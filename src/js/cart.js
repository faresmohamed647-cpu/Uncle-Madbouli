/**
 * Persistent Shopping Cart & Order Receipt Store (LocalStorage)
 */
import { ADDONS, BRAND_CONFIG, DELIVERY_DISTRICTS, PRODUCTS } from './data.js';

const CART_KEY = 'feteer_house_cart_v1';
const LAST_ORDER_KEY = 'feteer_house_last_order_v1';
const ORDERS_KEY = 'feteer_house_orders_v1';
const CUSTOMER_KEY = 'feteer_house_customer_v1';
const ACCOUNT_KEY = 'feteer_house_account_v1';
const DEFAULT_DISTRICT_ID = DELIVERY_DISTRICTS[0]?.id || 'sidi_bishr';

function normalizeDistrictId(id) {
  return DELIVERY_DISTRICTS.some((district) => district.id === id) ? id : DEFAULT_DISTRICT_ID;
}

const ordersChannel =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('feteer_house_orders_sync') : null;

function broadcastOrdersUpdate(orderNumber = null) {
  window.dispatchEvent(new CustomEvent('orders:updated', { detail: { orderNumber } }));
  if (ordersChannel) {
    try {
      ordersChannel.postMessage({ type: 'orders:updated', orderNumber, ts: Date.now() });
    } catch {
      // ignore broadcast errors
    }
  }
}

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items, count: getCartCount(items) } }));
}

export function getCartCount(items = getCart()) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function calculateUnitPrice(productId, sizeId = null, addonIds = []) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return 0;

  let unit = product.basePrice;
  if (product.hasSizes && product.sizes.length > 0) {
    const chosenSize = product.sizes.find((s) => s.id === sizeId) || product.sizes[0];
    unit = chosenSize?.price ?? (unit + (chosenSize?.priceDelta || 0));
  }

  for (const id of addonIds) {
    if (ADDONS[id]) {
      unit += ADDONS[id].price;
    }
  }

  return unit;
}

export function addToCart({
  productId,
  sizeId = null,
  addonIds = [],
  instructions = '',
  quantity = 1,
}) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;

  const resolvedSizeId =
    product.hasSizes && product.sizes.length > 0
      ? sizeId || product.sizes[0].id
      : null;

  const normalizedAddons = [...new Set(addonIds)].sort();
  const cleanNotes = String(instructions || '').trim();
  const qty = Math.max(1, Number(quantity) || 1);

  const cartItemId = `${productId}__${resolvedSizeId || 'std'}__${normalizedAddons.join(',')}__${cleanNotes}`;
  const unitPrice = calculateUnitPrice(productId, resolvedSizeId, normalizedAddons);

  const cart = getCart();
  const existing = cart.find((entry) => entry.cartItemId === cartItemId);
  if (existing) {
    existing.quantity += qty;
    existing.unitPrice = unitPrice;
  } else {
    cart.push({
      cartItemId,
      productId,
      sizeId: resolvedSizeId,
      addonIds: normalizedAddons,
      instructions: cleanNotes,
      quantity: qty,
      unitPrice,
    });
  }

  saveCart(cart);
  return cart;
}

export function updateQuantity(cartItemId, delta) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.cartItemId === cartItemId);
  if (idx === -1) return cart;

  const nextQty = cart[idx].quantity + delta;
  if (nextQty <= 0) {
    cart.splice(idx, 1);
  } else {
    cart[idx].quantity = nextQty;
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(cartItemId) {
  const cart = getCart().filter((item) => item.cartItemId !== cartItemId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotals(customDeliveryFee = BRAND_CONFIG.baseDeliveryFee) {
  const items = getCart();
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const isFreeDelivery = subtotal >= BRAND_CONFIG.freeDeliveryThreshold || subtotal === 0;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : customDeliveryFee;
  const total = subtotal + deliveryFee;
  const amountForFree = Math.max(0, BRAND_CONFIG.freeDeliveryThreshold - subtotal);

  return {
    items,
    count: getCartCount(items),
    subtotal,
    deliveryFee,
    total,
    isFreeDelivery,
    amountForFree,
  };
}

export function getOrderStageIndex(progress) {
  const val = Number(progress ?? 0);
  if (val >= 100) return 3;
  if (val >= 65) return 2;
  if (val >= 30) return 1;
  return 0;
}

export function getOrdersHistory() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore parse errors
  }

  // Migrate single legacy order if present
  const last = getLastOrderReceipt();
  if (last && last.orderNumber) {
    const list = [last];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    return list;
  }
  return [];
}

function writeOrdersHistory(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  if (orders.length > 0) {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(orders[0]));
  }
}

export function saveOrderReceipt(orderData) {
  const normalized = {
    paused: false,
    trackingProgress: 15,
    ...orderData,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(normalized));

  const history = getOrdersHistory().filter(
    (entry) => String(entry.orderNumber).toUpperCase() !== String(normalized.orderNumber).toUpperCase()
  );
  history.unshift(normalized);
  writeOrdersHistory(history);
  broadcastOrdersUpdate(normalized.orderNumber);
  return normalized;
}

export function getLastOrderReceipt() {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getOrderByNumber(orderNumber) {
  if (!orderNumber) return getOrdersHistory()[0] || getLastOrderReceipt();
  const target = String(orderNumber).trim().toUpperCase();
  const found = getOrdersHistory().find((o) => String(o.orderNumber).toUpperCase() === target);
  if (found) return found;
  const last = getLastOrderReceipt();
  if (last && String(last.orderNumber).toUpperCase() === target) return last;
  return null;
}

export function updateOrderByNumber(orderNumber, updates) {
  const history = getOrdersHistory();
  const target = String(orderNumber || history[0]?.orderNumber || '').trim().toUpperCase();
  if (!target) return null;

  let updatedOrder = null;
  const nextHistory = history.map((entry) => {
    if (String(entry.orderNumber).toUpperCase() !== target) return entry;
    const nextProgress =
      updates.trackingProgress !== undefined
        ? Math.max(0, Math.min(100, Math.round(updates.trackingProgress)))
        : entry.trackingProgress ?? 15;
    updatedOrder = {
      ...entry,
      ...updates,
      trackingProgress: nextProgress,
      updatedAt: new Date().toISOString(),
    };
    return updatedOrder;
  });

  if (!updatedOrder) return null;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(nextHistory));

  const last = getLastOrderReceipt();
  if (!last || String(last.orderNumber).toUpperCase() === target) {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(updatedOrder));
  }

  broadcastOrdersUpdate(updatedOrder.orderNumber);
  return updatedOrder;
}

export function updateOrderTrackingProgress(progress, orderNumber = null) {
  const targetOrder = orderNumber ? getOrderByNumber(orderNumber) : getLastOrderReceipt() || getOrdersHistory()[0];
  if (!targetOrder) return null;
  return updateOrderByNumber(targetOrder.orderNumber, { trackingProgress: progress });
}

export function subscribeOrderUpdates(callback) {
  const onStorage = (e) => {
    if (!e.key || e.key === ORDERS_KEY || e.key === LAST_ORDER_KEY) {
      callback();
    }
  };
  const onCustom = () => callback();
  const onChannel = () => callback();

  window.addEventListener('storage', onStorage);
  window.addEventListener('orders:updated', onCustom);
  if (ordersChannel) {
    ordersChannel.addEventListener('message', onChannel);
  }

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('orders:updated', onCustom);
    if (ordersChannel) {
      ordersChannel.removeEventListener('message', onChannel);
    }
  };
}

export function createDemoOrderReceipt() {
  const demo = {
    orderNumber: `FH-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    trackingProgress: 15,
    paused: false,
    customer: {
      fullName: 'كريم طارق / Karim Tarek',
      phone: '01012345678',
      district: { ar: 'سيدي بشر', en: 'Sidi Bishr' },
      address: '26th of July St, Building 18, Apt 4',
      notes: '',
    },
    items: [
      {
        name: { ar: 'فطير سجق بلدي', en: 'Feteer with Sausage' },
        size: { ar: 'كبير', en: 'Large' },
        quantity: 1,
        lineTotal: 230,
      },
      {
        name: { ar: 'فطير نوتيلا وبندق', en: 'Nutella Feteer' },
        size: { ar: 'وسط', en: 'Medium' },
        quantity: 1,
        lineTotal: 155,
      },
    ],
    subtotal: 385,
    deliveryFee: 25,
    total: 410,
  };
  return saveOrderReceipt(demo);
}

function makeEmptyAccount() {
  return {
    fullName: '',
    phones: [],
    addresses: [],
    preferences: {
      bakingStyle: 'standard',
      cutPreference: '8_slices',
      courierArrival: 'call',
      defaultNotes: '',
    },
  };
}

export function getAccountData() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...makeEmptyAccount(),
        ...parsed,
        phones: Array.isArray(parsed.phones) ? parsed.phones : [],
        addresses: Array.isArray(parsed.addresses)
          ? parsed.addresses.map((address) => ({ ...address, districtId: normalizeDistrictId(address.districtId) }))
          : [],
        preferences: { ...makeEmptyAccount().preferences, ...(parsed.preferences || {}) },
      };
    }
  } catch {
    // ignore parse errors
  }

  // Migrate legacy single profile if present
  try {
    const legacyRaw = localStorage.getItem(CUSTOMER_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      const migrated = makeEmptyAccount();
      migrated.fullName = legacy.fullName || '';
      if (legacy.phone) {
        migrated.phones.push({
          id: 'ph_default',
          label: 'Primary',
          number: legacy.phone,
          isDefault: true,
        });
      }
      if (legacy.streetAddress) {
        migrated.addresses.push({
          id: 'addr_default',
          label: 'Home',
          districtId: normalizeDistrictId(legacy.districtId),
          streetAddress: legacy.streetAddress || '',
          buildingDetails: legacy.buildingDetails || '',
          notes: legacy.notes || '',
          isDefault: true,
        });
      }
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    // ignore
  }

  return makeEmptyAccount();
}

export function saveAccountData(account) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  const defaultAddr = account.addresses.find((a) => a.isDefault) || account.addresses[0];
  const defaultPhone = account.phones.find((p) => p.isDefault) || account.phones[0];
  if (account.fullName || defaultAddr || defaultPhone) {
    localStorage.setItem(
      CUSTOMER_KEY,
      JSON.stringify({
        fullName: account.fullName || '',
        phone: defaultPhone?.number || '',
        districtId: normalizeDistrictId(defaultAddr?.districtId),
        streetAddress: defaultAddr?.streetAddress || '',
        buildingDetails: defaultAddr?.buildingDetails || '',
        notes: defaultAddr?.notes || account.preferences?.defaultNotes || '',
      })
    );
  }
  return account;
}

export function upsertAddress(addressInput) {
  const account = getAccountData();
  const id = addressInput.id || `addr_${Date.now()}`;
  const existingIdx = account.addresses.findIndex((a) => a.id === id);
  const shouldBeDefault = Boolean(addressInput.isDefault) || account.addresses.length === 0;

  const entry = {
    id,
    label: String(addressInput.label || '').trim() || 'Home',
    districtId: normalizeDistrictId(addressInput.districtId),
    streetAddress: String(addressInput.streetAddress || '').trim(),
    buildingDetails: String(addressInput.buildingDetails || '').trim(),
    notes: String(addressInput.notes || '').trim(),
    isDefault: shouldBeDefault,
  };

  if (shouldBeDefault) {
    account.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  if (existingIdx >= 0) {
    account.addresses[existingIdx] = { ...account.addresses[existingIdx], ...entry };
  } else {
    account.addresses.push(entry);
  }

  if (!account.addresses.some((a) => a.isDefault) && account.addresses.length > 0) {
    account.addresses[0].isDefault = true;
  }

  return saveAccountData(account);
}

export function setDefaultAddress(addressId) {
  const account = getAccountData();
  account.addresses.forEach((a) => {
    a.isDefault = a.id === addressId;
  });
  return saveAccountData(account);
}

export function deleteAddress(addressId) {
  const account = getAccountData();
  account.addresses = account.addresses.filter((a) => a.id !== addressId);
  if (account.addresses.length > 0 && !account.addresses.some((a) => a.isDefault)) {
    account.addresses[0].isDefault = true;
  }
  return saveAccountData(account);
}

export function upsertPhone(phoneInput) {
  const account = getAccountData();
  const id = phoneInput.id || `ph_${Date.now()}`;
  const existingIdx = account.phones.findIndex((p) => p.id === id);
  const shouldBeDefault = Boolean(phoneInput.isDefault) || account.phones.length === 0;

  const entry = {
    id,
    label: String(phoneInput.label || '').trim() || 'Mobile',
    number: String(phoneInput.number || '').trim(),
    isDefault: shouldBeDefault,
  };

  if (shouldBeDefault) {
    account.phones.forEach((p) => {
      p.isDefault = false;
    });
  }

  if (existingIdx >= 0) {
    account.phones[existingIdx] = { ...account.phones[existingIdx], ...entry };
  } else {
    account.phones.push(entry);
  }

  if (!account.phones.some((p) => p.isDefault) && account.phones.length > 0) {
    account.phones[0].isDefault = true;
  }

  return saveAccountData(account);
}

export function setDefaultPhone(phoneId) {
  const account = getAccountData();
  account.phones.forEach((p) => {
    p.isDefault = p.id === phoneId;
  });
  return saveAccountData(account);
}

export function deletePhone(phoneId) {
  const account = getAccountData();
  account.phones = account.phones.filter((p) => p.id !== phoneId);
  if (account.phones.length > 0 && !account.phones.some((p) => p.isDefault)) {
    account.phones[0].isDefault = true;
  }
  return saveAccountData(account);
}

export function saveAccountPreferences(prefs) {
  const account = getAccountData();
  account.preferences = { ...account.preferences, ...prefs };
  return saveAccountData(account);
}

export function getCustomerProfile() {
  const account = getAccountData();
  const defaultAddr = account.addresses.find((a) => a.isDefault) || account.addresses[0];
  const defaultPhone = account.phones.find((p) => p.isDefault) || account.phones[0];

  if (account.fullName || defaultAddr || defaultPhone) {
    return {
      fullName: account.fullName || '',
      phone: defaultPhone?.number || '',
      districtId: normalizeDistrictId(defaultAddr?.districtId),
      streetAddress: defaultAddr?.streetAddress || '',
      buildingDetails: defaultAddr?.buildingDetails || '',
      notes: defaultAddr?.notes || account.preferences?.defaultNotes || '',
      preferences: account.preferences,
    };
  }

  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCustomerProfile(profile) {
  const account = getAccountData();
  if (profile.fullName) {
    account.fullName = profile.fullName;
  }
  if (profile.phone) {
    const existingDefault = account.phones.find((p) => p.isDefault) || account.phones[0];
    if (existingDefault) {
      existingDefault.number = profile.phone;
    } else {
      account.phones.push({
        id: 'ph_default',
        label: 'Primary',
        number: profile.phone,
        isDefault: true,
      });
    }
  }
  if (profile.streetAddress) {
    const existingAddr = account.addresses.find((a) => a.isDefault) || account.addresses[0];
    if (existingAddr) {
      existingAddr.districtId = normalizeDistrictId(profile.districtId || existingAddr.districtId);
      existingAddr.streetAddress = profile.streetAddress;
      existingAddr.buildingDetails = profile.buildingDetails ?? existingAddr.buildingDetails;
      existingAddr.notes = profile.notes ?? existingAddr.notes;
    } else {
      account.addresses.push({
        id: 'addr_default',
        label: 'Home',
        districtId: normalizeDistrictId(profile.districtId),
        streetAddress: profile.streetAddress,
        buildingDetails: profile.buildingDetails || '',
        notes: profile.notes || '',
        isDefault: true,
      });
    }
  }
  saveAccountData(account);
  return profile;
}
