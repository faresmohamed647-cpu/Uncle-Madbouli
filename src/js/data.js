/**
 * Feteer House — Central Catalog & Brand Configuration
 * Easily edit brand name, contact details, delivery fees, categories, and menu prices here.
 */

export const BRAND_CONFIG = {
  name: { ar: 'عم مدبولي', en: 'Amo Madbouly' },
  tagline: { ar: 'طعم زمان.. على كيف كيفك', en: 'A taste of tradition, made your way' },
  currency: {
    ar: 'ج.م',
    en: 'EGP',
  },
  phone: '01125300373',
  phoneHref: 'tel:+201125300373',
  whatsappNumber: '201125300373',
  email: 'orders@feteerhouse.eg',
  address: { ar: '١١ شارع العيسوي الرئيسي، من شارع محمد نجيب، الإسكندرية', en: '11 El Eissawy Main St, off Mohamed Naguib St, Alexandria' },
  hours: {
    ar: 'يومياً من ١٠:٠٠ صباحاً حتى ٢:٠٠ بعد منتصف الليل',
    en: 'Daily from 10:00 AM to 2:00 AM',
  },
  baseDeliveryFee: 35,
  freeDeliveryThreshold: 450,
  mapsUrl: 'https://maps.google.com/?q=11+El+Eissawy+Main+Street+off+Mohamed+Naguib+Alexandria+Egypt',
};

export const DELIVERY_DISTRICTS = [
  { id: 'sidi_bishr', name: { ar: 'سيدي بشر', en: 'Sidi Bishr' }, fee: 25 },
  { id: 'miami', name: { ar: 'ميامي', en: 'Miami' }, fee: 25 },
  { id: 'asafra', name: { ar: 'العصافرة', en: 'Asafra' }, fee: 30 },
  { id: 'mandara', name: { ar: 'المندرة', en: 'Mandara' }, fee: 30 },
  { id: 'montaza', name: { ar: 'المنتزه', en: 'Montaza' }, fee: 35 },
  { id: 'gleem', name: { ar: 'جليم', en: 'Gleem' }, fee: 35 },
  { id: 'stanley', name: { ar: 'ستانلي', en: 'Stanley' }, fee: 35 },
  { id: 'roushdy', name: { ar: 'رشدي', en: 'Roushdy' }, fee: 35 },
  { id: 'sporting', name: { ar: 'سبورتنج', en: 'Sporting' }, fee: 40 },
  { id: 'sidi_gaber', name: { ar: 'سيدي جابر', en: 'Sidi Gaber' }, fee: 40 },
  { id: 'smouha', name: { ar: 'سموحة', en: 'Smouha' }, fee: 40 },
  { id: 'ibrahimia', name: { ar: 'الإبراهيمية', en: 'Ibrahimia' }, fee: 40 },
  { id: 'mansheya', name: { ar: 'المنشية والعطارين', en: 'Mansheya & Attarin' }, fee: 45 },
  { id: 'moharram_bek', name: { ar: 'محرم بك', en: 'Moharram Bek' }, fee: 45 },
  { id: 'agami', name: { ar: 'العجمي', en: 'Agami' }, fee: 50 },
  { id: 'borg_el_arab', name: { ar: 'برج العرب', en: 'Borg El Arab' }, fee: 50 },
];
export const CATEGORIES = [
  {
    id: 'savory',
    name: { ar: 'فطائر اللحوم', en: 'Meat Pies' },
    icon: 'fa-solid fa-fire-burner',
  },
  {
    id: 'chicken',
    name: { ar: 'فطائر الفراخ', en: 'Chicken Pies' },
    icon: 'fa-solid fa-drumstick-bite',
  },
  {
    id: 'pasta',
    name: { ar: 'باستا', en: 'Pasta' },
    icon: 'fa-solid fa-bowl-food',
  },
  {
    id: 'cheese',
    name: { ar: 'فطائر الجبن', en: 'Cheese Pies' },
    icon: 'fa-solid fa-cheese',
  },
  {
    id: 'seafood',
    name: { ar: 'فطائر السي فود', en: 'Seafood Pies' },
    icon: 'fa-solid fa-fish',
  },
  {
    id: 'sweet',
    name: { ar: 'فطائر الحلو', en: 'Sweet Pies' },
    icon: 'fa-solid fa-cookie-bite',
  },
  {
    id: 'meshaltet',
    name: { ar: 'فطير مشلتت', en: 'Meshaltet' },
    icon: 'fa-solid fa-layer-group',
  },
  {
    id: 'pizza',
    name: { ar: 'بيتزا', en: 'Pizza' },
    icon: 'fa-solid fa-pizza-slice',
  },
  {
    id: 'drinks',
    name: { ar: 'المشروبات', en: 'Drinks' },
  icon: 'fa-solid fa-mug-hot',
  },
  {
    id: 'extras',
    name: { ar: 'الإضافات', en: 'Extras' },
    icon: 'fa-solid fa-jar',
  },
];

export const ADDONS = {
  extra_cheese: { id: 'extra_cheese', name: { ar: 'جبنة موتزاريلا إضافية', en: 'Extra Mozzarella Cheese' }, price: 30 },
  extra_sausage: { id: 'extra_sausage', name: { ar: 'سجق بلدي إضافي', en: 'Extra Oriental Sausage' }, price: 40 },
  baladi_qishta: { id: 'baladi_qishta', name: { ar: 'قشطة بلدي طازجة', en: 'Fresh Baladi Cream' }, price: 35 },
  white_honey: { id: 'white_honey', name: { ar: 'عسل نحل صافي', en: 'Pure Wildflower Honey' }, price: 25 },
  roasted_nuts: { id: 'roasted_nuts', name: { ar: 'مكسرات محمصة وفستق', en: 'Roasted Nuts & Pistachio' }, price: 40 },
  jalapeno: { id: 'jalapeno', name: { ar: 'فلفل هالوبينو وزيتون', en: 'Jalapeño & Olives' }, price: 15 },
};

const FETEER_SIZES = [
  { id: 'medium', label: { ar: 'وسط', en: 'Medium' }, priceDelta: 0 },
  { id: 'large', label: { ar: 'كبير', en: 'Large' }, priceDelta: 55 },
  { id: 'family', label: { ar: 'عائلي', en: 'Family' }, priceDelta: 105 },
];

export { MENU_PRODUCTS as PRODUCTS } from './menu-catalog.js';

export const SPECIAL_OFFERS = [
  {
    id: 'offer-family-feast',
    badge: { ar: 'وفر ٧٥ ج.م', en: 'Save 75 EGP' },
    title: { ar: 'عرض لمة العيلة', en: 'Family Gathering Box' },
    description: {
      ar: 'فطيرة سجق بلدي كبيرة + فطيرة نوتيلا وسط + ٢ شاي بالنعناع.',
      en: '1 Large Sausage Feteer + 1 Medium Nutella Feteer + 2 Mint Teas.',
    },
    originalPrice: 435,
    offerPrice: 360,
    image: '/images/feteer_savory_sausage_1795352551694.jpg',
    productId: 'savory-sausage',
    defaultSizeId: 'large',
  },
  {
    id: 'offer-country-breakfast',
    badge: { ar: 'وفر ٦٠ ج.م', en: 'Save 60 EGP' },
    title: { ar: 'فطار المشلتت الفلاحي', en: 'Countryside Meshaltet Combo' },
    description: {
      ar: 'فطير مشلتت كبير بالسمن البلدي + علبة قشطة + برطمان عسل صافي + ٢ عصير.',
      en: '1 Large Baladi Meshaltet + Fresh Qishta + Honey Jar + 2 Fresh Juices.',
    },
    originalPrice: 380,
    offerPrice: 320,
    image: '/images/feteer_meshaltet_classic_1795352553015.jpg',
    productId: 'meshaltet-plain',
    defaultSizeId: 'large',
  },
];

export const WHY_CHOOSE_US = [
  {
    icon: 'fa-solid fa-wheat-awn',
    title: { ar: 'مكونات طازجة يومياً', en: 'Fresh Ingredients' },
    desc: {
      ar: 'دقيق فاخر، سمن بلدي صافي ١٠٠٪، وخضروات وأجبان يتم تحضيرها كل صباح.',
      en: 'Fine flour, 100% pure baladi ghee, and farm-fresh cheeses prepared every morning.',
    },
  },
  {
    icon: 'fa-solid fa-fire',
    title: { ar: 'طعم مصري أصيل', en: 'Traditional Taste' },
    desc: {
      ar: 'فرد يدوي تقليدي وخبز في أفران حجرية يمنحك قرمشة ذهبية وطبقات هشة.',
      en: 'Hand-stretched layers baked on hot stone hearths for unmistakable golden flakiness.',
    },
  },
  {
    icon: 'fa-solid fa-heart',
    title: { ar: 'يُصنع بحب وشغف', en: 'Made with Love' },
    desc: {
      ar: 'كل فطيرة تُفرد وتُحشى عند الطلب خصيصاً لتصلك طازجة كما تخرج من الفرن.',
      en: 'Every feteer is stretched and stuffed to order so it arrives warm and crisp.',
    },
  },
  {
    icon: 'fa-solid fa-motorcycle',
    title: { ar: 'توصيل سريع وساخن', en: 'Fast Delivery' },
    desc: {
      ar: 'عبوات حرارية تحافظ على القرمشة والحرارة لتصل لباب بيتك خلال ٣٥-٤٥ دقيقة.',
      en: 'Insulated bakery boxes keep layers crisp and hot to your door in 35–45 mins.',
    },
  },
];

export const REVIEWS = [
  {
    name: { ar: 'سارة عبد الرحمن', en: 'Sara Abdelrahman' },
    area: { ar: 'سموحة · طلبت مشلتت بالقشطة', en: 'Smouha · Ordered Meshaltet with Cream' },
    quote: {
      ar: 'أفضل فطير مشلتت أكلته في الإسكندرية من سنين. الطبقات خفيفة جداً والسمن البلدي واضح بدون ما يكون تقيل، ووصل سخن كأنه لسه طالع من الفرن.',
      en: 'The flakiest meshaltet I have had in Alexandria in years. Delicate layers, real baladi ghee without feeling heavy, and arrived piping hot.',
    },
  },
  {
    name: { ar: 'أحمد حسام الدين', en: 'Ahmed Hossam' },
    area: { ar: 'المهندسين · طلب فطير سجق ونوتيلا', en: 'Mohandessin · Ordered Sausage & Nutella Feteer' },
    quote: {
      ar: 'الطلب أونلاين سهل جداً وتقدر تختار الحجم والإضافات بوضوح. فطيرة السجق حشوها غني ومظبوط والنوتيلا بالبندق كانت مفاجأة العيلة كلها.',
      en: 'Ordering online was effortless with clear sizes and add-ons. The sausage feteer was generously stuffed and the Nutella hazelnut feteer stole the show.',
    },
  },
  {
    name: { ar: 'منى الشريف', en: 'Mona El-Sherif' },
    area: { ar: 'المعادي · طلبت عرض لمة العيلة', en: 'Maadi · Ordered Family Gathering Box' },
    quote: {
      ar: 'التغليف شيك جداً ونضيف والتوصيل التزم بالوقت بالظبط. جودة العجين والأجبان بتفكرك بفطير البيت الأصلي.',
      en: 'Clean, sturdy packaging and right-on-time delivery. The dough and cheese quality tastes just like authentic homemade Egyptian baking.',
    },
  },
];

export const UI_TEXT = {
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    menu: { ar: 'المنيو', en: 'Menu' },
    about: { ar: 'قصتنا', en: 'About Us' },
    contact: { ar: 'تواصل معنا', en: 'Contact' },
    track: { ar: 'تتبع طلبك', en: 'Track Order' },
    orderNow: { ar: 'اطلب الآن', en: 'Order Now' },
    cart: { ar: 'سلة الطلبات', en: 'Shopping Cart' },
  },
  hero: {
    kicker: { ar: 'مخبز وفطاطري مصري فاخر · سمن بلدي صافي', en: 'Artisanal Egyptian Bakery · Pure Baladi Ghee' },
    headline: {
      ar: 'فطير مصري أصيل... طبقات من السمن البلدي والقرمشة الذهبية',
      en: 'Authentic Egyptian Feteer — Golden Layers of Pure Craft',
    },
    desc: {
      ar: 'فطير مشلتت، فطير شرقي حادق وحلو، وبيتزا مخبوزة على الحجر تُحضر طازجة عند الطلب وتصلك ساخنة لحد باب بيتك.',
      en: 'Hand-stretched meshaltet, stuffed savory and sweet feteer, and stone-baked pizza prepared fresh to order and delivered warm.',
    },
    exploreBtn: { ar: 'تصفح المنيو', en: 'Explore Menu' },
    orderBtn: { ar: 'اطلب الآن', en: 'Order Now' },
    stats: [
      { val: { ar: '٣٢+ طبقة', en: '32+ Layers' }, label: { ar: 'فرد يدوي تقليدي', en: 'Hand-stretched dough' } },
      { val: { ar: '٣٥ دقيقة', en: '35 Mins' }, label: { ar: 'متوسط التوصيل', en: 'Avg. hot delivery' } },
      { val: { ar: '١٠٠٪', en: '100%' }, label: { ar: 'سمن بلدي طبيعي', en: 'Pure baladi ghee' } },
    ],
  },
  sections: {
    categoriesKicker: { ar: 'أقسام المخبز', en: 'Our Craft' },
    categoriesTitle: { ar: 'استكشف أصناف الفطير والمخبوزات', en: 'Explore Our Categories' },
    bestSellersKicker: { ar: 'اختيارات عملائنا', en: 'Customer Favorites' },
    bestSellersTitle: { ar: 'الأكثر مبيعاً عند عم مدبولي', en: 'Best Sellers' },
    viewFullMenu: { ar: 'عرض المنيو بالكامل', en: 'View Full Menu' },
    offersKicker: { ar: 'باقات التوفير', en: 'Curated Combos' },
    offersTitle: { ar: 'عروض خاصة للعيلة والأصدقاء', en: 'Special Offers' },
    whyKicker: { ar: 'سر تميزنا', en: 'Why Feteer House' },
    whyTitle: { ar: 'ليه تختار عم مدبولي؟', en: 'Why Choose Us' },
    reviewsKicker: { ar: 'آراء عملائنا', en: 'Testimonials' },
    reviewsTitle: { ar: 'كلمات نسعد بها كل يوم', en: 'Customer Reviews' },
  },
  common: {
    addToCart: { ar: 'أضف للسلة', en: 'Add to Cart' },
    customize: { ar: 'تخصيص الطلب', en: 'Customize' },
    viewDetails: { ar: 'التفاصيل', en: 'Details' },
    orderOffer: { ar: 'اطلب العرض', en: 'Order Offer' },
    allCategories: { ar: 'كل الأصناف', en: 'All Items' },
    searchPlaceholder: { ar: 'ابحث عن فطير، مشلتت، بيتزا...', en: 'Search feteer, meshaltet, pizza...' },
    noResults: { ar: 'لم نجد أصنافاً مطابقة لبحثك.', en: 'No matching items found.' },
    resetFilters: { ar: 'عرض كل الأصناف', en: 'Show All Items' },
    bestSellerTag: { ar: 'الأكثر مبيعاً', en: 'Best Seller' },
    itemsCount: { ar: 'صنف', en: 'items' },
    addedToast: { ar: 'تمت الإضافة إلى السلة', en: 'Added to your cart' },
    viewCart: { ar: 'عرض السلة', en: 'View Cart' },
  },
  product: {
    selectSize: { ar: 'اختر الحجم', en: 'Choose Size' },
    selectAddons: { ar: 'إضافات وتوبينج حسب رغبتك', en: 'Extra Toppings & Add-ons' },
    quantity: { ar: 'الكمية', en: 'Quantity' },
    instructions: { ar: 'ملاحظات خاصة للخبز أو التقطيع', en: 'Special Instructions' },
    instructionsPlaceholder: {
      ar: 'مثال: تسوية مقرمشة زيادة، تقطيع ٨ قطع، بدون فلفل...',
      en: 'e.g., Extra crispy crust, cut into 8 slices, no peppers...',
    },
    totalPrice: { ar: 'الإجمالي', en: 'Total Price' },
    includedPrice: { ar: 'السعر الأساسي', en: 'Included' },
    relatedTitle: { ar: 'أصناف أخرى قد تعجبك', en: 'You May Also Enjoy' },
  },
  cart: {
    title: { ar: 'سلة الطلبات', en: 'Shopping Cart' },
    subtitle: { ar: 'راجع اختياراتك أو عدّل الكميات قبل إتمام الطلب.', en: 'Review your customized feteer and quantities before checkout.' },
    emptyTitle: { ar: 'سلتك فارغة حالياً', en: 'Your cart is currently empty' },
    emptyDesc: { ar: 'اكتشف تشكيلتنا من الفطير الحادق والحلو والمشلتت الساخن.', en: 'Explore our fresh savory, sweet, and traditional meshaltet feteer.' },
    browseMenu: { ar: 'تصفح المنيو الآن', en: 'Browse Menu' },
    remove: { ar: 'حذف', en: 'Remove' },
    subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
    deliveryFee: { ar: 'رسوم التوصيل', en: 'Delivery Fee' },
    freeDelivery: { ar: 'مجاني', en: 'Free' },
    total: { ar: 'الإجمالي النهائي', en: 'Total' },
    continueShopping: { ar: 'مواصلة التسوق', en: 'Continue Shopping' },
    proceedCheckout: { ar: 'إتمام الطلب', en: 'Proceed to Checkout' },
    freeDeliveryAchieved: { ar: 'تهانينا! لقد حصلت على توصيل مجاني لطلبك.', en: 'You unlocked free delivery on this order!' },
    freeDeliveryRemaining: { ar: 'أضف بقيمة {amount} للحصول على توصيل مجاني.', en: 'Add {amount} more for free delivery.' },
  },
  checkout: {
    title: { ar: 'إتمام الطلب', en: 'Checkout' },
    subtitle: { ar: 'أدخل بيانات التوصيل لتجهيز فطيرك طازجاً الآن.', en: 'Enter your delivery details so we can bake your order fresh.' },
    customerDetails: { ar: 'بيانات العميل والعنوان', en: 'Customer & Delivery Information' },
    fullName: { ar: 'الاسم بالكامل', en: 'Full Name' },
    phone: { ar: 'رقم الموبايل (١١ رقم)', en: 'Phone Number' },
    district: { ar: 'المنطقة / الحي', en: 'Area / District' },
    selectDistrict: { ar: 'اختر المنطقة...', en: 'Select area...' },
    address: { ar: 'العنوان بالتفصيل (الشارع، العمارة، الشقة)', en: 'Delivery Address (Street, Building, Flat)' },
    notes: { ar: 'ملاحظات إضافية للمندوب (اختياري)', en: 'Additional Delivery Notes (Optional)' },
    paymentMethod: { ar: 'طريقة الدفع', en: 'Payment Method' },
    codLabel: { ar: 'الدفع نقداً عند الاستلام (كاش)', en: 'Cash on Delivery (COD)' },
    codHint: { ar: 'ادفع عند استلام الطلب ساخناً', en: 'Pay in cash when your order arrives hot' },
    orderSummary: { ar: 'ملخص الطلب', en: 'Order Summary' },
    confirmOrder: { ar: 'تأكيد وإرسال الطلب', en: 'Confirm Order' },
    errors: {
      fullName: { ar: 'يرجى كتابة الاسم بالكامل (٣ أحرف على الأقل).', en: 'Please enter your full name (at least 3 characters).' },
      phone: { ar: 'يرجى إدخال رقم موبايل مصري صحيح مكون من ١١ رقم.', en: 'Please enter a valid 11-digit Egyptian mobile number (01xxxxxxxxx).' },
      district: { ar: 'يرجى اختيار منطقة التوصيل.', en: 'Please select a delivery district.' },
      address: { ar: 'من فضلك أدخل عنوان التوصيل بالكامل.', en: 'Please enter your full delivery address.' },
    },
    confirmedTitle: { ar: 'تم استلام طلبك بنجاح!', en: 'Order Confirmed!' },
    confirmedSubtitle: {
      ar: 'فريق المخبز بدأ الآن في فرد وخبز طلبك طازجاً. سيصل المندوب خلال ٣٥ إلى ٤٥ دقيقة.',
      en: 'Our bakers have started stretching and baking your order fresh. Expected arrival in 35–45 minutes.',
    },
    orderRef: { ar: 'رقم الطلب المرجعي', en: 'Order Reference' },
    backHome: { ar: 'العودة للرئيسية', en: 'Back to Home' },
    orderMore: { ar: 'طلب جديد من المنيو', en: 'Order More' },
    trackOrderBtn: { ar: 'تأكيد الطلب ومتابعة التوصيل', en: 'Confirm & Track Order' },
    savedNotice: { ar: 'تم تعبئة بيانات التوصيل المحفوظة تلقائياً.', en: 'Pre-filled from your saved delivery details.' },
    editDetails: { ar: 'إدارة حسابي وعناويني', en: 'Manage Account & Addresses' },
    savedAddressPick: { ar: 'اختر من عناوينك المحفوظة', en: 'Choose from saved addresses' },
    savedPhonePick: { ar: 'اختر رقم الهاتف', en: 'Choose phone number' },
  },
  delivery: {
    navLabel: { ar: 'بيانات التوصيل', en: 'Delivery Details' },
    title: { ar: 'بيانات التوصيل وعنوانك', en: 'Your Delivery Details' },
    subtitle: {
      ar: 'احفظ اسمك وعنوانك مرة واحدة عند بدء الطلب لتجربة سريعة في كل خطوة.',
      en: 'Save your address and contact details upfront for faster ordering and checkout.',
    },
    buildingLabel: { ar: 'رقم العمارة / الدور / الشقة', en: 'Building / Floor / Apartment' },
    landmarkLabel: { ar: 'علامة مميزة أو تعليمات للمندوب (اختياري)', en: 'Nearby Landmark or Courier Notes (Optional)' },
    saveAndMenu: { ar: 'حفظ البيانات والانتقال للمنيو', en: 'Save & Explore Menu' },
    saveAndCheckout: { ar: 'حفظ البيانات والعودة لإتمام الطلب', en: 'Save & Continue to Checkout' },
    skipToMenu: { ar: 'تخطي وتصفح المنيو الآن', en: 'Skip & Browse Menu' },
    savedSuccess: { ar: 'تم حفظ بيانات التوصيل بنجاح!', en: 'Delivery details saved successfully!' },
    estimatedFeeLabel: { ar: 'رسوم التوصيل المقدرة لمنطقتك', en: 'Estimated delivery fee for your area' },
  },
  track: {
    title: { ar: 'تأكيد الطلب ومتابعة التوصيل', en: 'Order Confirmation & Tracking' },
    subtitle: {
      ar: 'تابع مراحل تحضير فطيرك في الفرن وتوصيله طازجاً لباب بيتك.',
      en: 'Follow your feteer from oven preparation to warm doorstep delivery.',
    },
    confirmedBannerTitle: { ar: 'تم تأكيد طلبك بنجاح!', en: 'Your Order Is Confirmed!' },
    confirmedBannerDesc: {
      ar: 'استلمنا طلبك الآن، ويمكنك متابعة كل مرحلة من مراحل التجهيز والتوصيل مباشرة من هنا.',
      en: 'We have received your order. Track every preparation and delivery stage live below.',
    },
    emptyTitle: { ar: 'لا يوجد طلب نشط حالياً', en: 'No recent order found' },
    emptyDesc: {
      ar: 'أتمم طلباً من المنيو أو جرب محاكاة تتبع طلب تجريبي لمشاهدة مراحل التوصيل.',
      en: 'Place an order from the menu or start a simulated demo order to preview live delivery tracking.',
    },
    startDemo: { ar: 'تجربة تتبع طلب تجريبي', en: 'Simulate Sample Order' },
    progressLabel: { ar: 'نسبة إتمام التوصيل', en: 'Delivery Progress' },
    etaLabel: { ar: 'الوقت المتبقي المتوقع', en: 'Estimated Time Remaining' },
    minutesUnit: { ar: 'دقيقة', en: 'mins' },
    arrivedText: { ar: 'وصل طلبك! بالهنا والشفا', en: 'Delivered! Enjoy your fresh Feteer' },
    liveUpdateNote: {
      ar: 'تتحدّث حالة طلبك تلقائياً فور تأكيد المخبز لكل مرحلة.',
      en: 'Order status updates automatically as our kitchen confirms each stage.',
    },
    stageToastPrefix: { ar: 'تحديث من المخبز:', en: 'Kitchen update:' },
    advanceBtn: { ar: 'تسريع المرحلة التالية', en: 'Advance Next Stage' },
    pauseBtn: { ar: 'إيقاف مؤقت', en: 'Pause' },
    resumeBtn: { ar: 'استئناف المحاكاة', en: 'Resume' },
    resetBtn: { ar: 'إعادة المحاكاة', en: 'Restart Simulation' },
    lookupPlaceholder: { ar: 'أدخل رقم الطلب مثل FH-4821', en: 'Enter order ref e.g. FH-4821' },
    lookupBtn: { ar: 'بحث', en: 'Find' },
    lookupNotFound: {
      ar: 'لم نجد طلباً بهذا الرقم على هذا الجهاز. يعرض التتبع أحدث طلب مسجل.',
      en: 'No matching order was found in this browser. Showing your most recent saved order.',
    },
    stages: [
      {
        title: { ar: 'تم استلام وتأكيد الطلب', en: 'Order Confirmed' },
        desc: { ar: 'تم تأكيد طلبك وإرساله فوراً إلى فريق الخبازين.', en: 'Your order is confirmed and sent straight to our bakers.' },
      },
      {
        title: { ar: 'الفرد والتسوية في الفرن', en: 'Hand-Stretching & Fresh Baking' },
        desc: {
          ar: 'يُفرد الفطير يدوياً بالسمن البلدي الصافي ويُخبز طازجاً في فرننا البلدي الساخن حتى القرمشة الذهبية.',
          en: 'Your feteer is hand-stretched with pure baladi ghee and baked fresh until golden and flaky.',
        },
      },
      {
        title: { ar: 'جاري التوصيل', en: 'Out for Delivery' },
        desc: { ar: 'الطلب في العلبة الحرارية وفي طريقه إليك مع المندوب.', en: 'Packed in an insulated box and en route with our rider.' },
      },
      {
        title: { ar: 'تم التوصيل', en: 'Delivered' },
        desc: { ar: 'وصل فطيرك ساخناً ومقرمشاً إلى عنوانك.', en: 'Your hot, flaky feteer has arrived at your door.' },
      },
    ],
  },
  account: {
    navLabel: { ar: 'حسابي', en: 'My Account' },
    title: { ar: 'حسابي وطلباتي', en: 'My Account & Orders' },
    subtitle: {
      ar: 'تابع طلباتك السابقة، وأدر عناوين التوصيل وأرقام الهواتف وتفضيلات الطلب الافتراضية.',
      en: 'Review your past orders, manage saved delivery addresses, phone numbers, and checkout preferences.',
    },
    myOrdersTitle: { ar: 'طلباتي السابقة', en: 'My Orders' },
    myOrdersSubtitle: {
      ar: 'جميع طلباتك المسجلة بحالتها الحالية وإجمالي التكلفة.',
      en: 'Your recorded orders with live status and total cost.',
    },
    noOrders: {
      ar: 'لا توجد طلبات مسجلة حتى الآن. ابدأ طلبك الأول من المنيو!',
      en: 'No past orders found yet. Place your first order from our menu!',
    },
    orderTotalLabel: { ar: 'الإجمالي', en: 'Total' },
    trackThisOrder: { ar: 'تتبع الطلب', en: 'Track Order' },
    profileTitle: { ar: 'البيانات الشخصية', en: 'Personal Details' },
    saveProfileBtn: { ar: 'حفظ الاسم', en: 'Save Name' },
    phonesTitle: { ar: 'أرقام الهواتف المحفوظة', en: 'Saved Phone Numbers' },
    phoneLabelField: { ar: 'وصف الرقم (مثلاً: شخصي، العمل)', en: 'Label (e.g., Personal, Work)' },
    addPhoneBtn: { ar: 'إضافة رقم', en: 'Add Phone' },
    addressesTitle: { ar: 'عناوين التوصيل المحفوظة', en: 'Saved Delivery Addresses' },
    addressLabelField: { ar: 'اسم العنوان (مثلاً: المنزل، العمل)', en: 'Address Label (e.g., Home, Office)' },
    addAddressBtn: { ar: 'حفظ العنوان الجديد', en: 'Save New Address' },
    updateAddressBtn: { ar: 'تحديث العنوان', en: 'Update Address' },
    cancelEditBtn: { ar: 'إلغاء التعديل', en: 'Cancel Edit' },
    prefsTitle: { ar: 'تفضيلات إتمام الطلب الافتراضية', en: 'Default Checkout Preferences' },
    bakingLabel: { ar: 'درجة تسوية الفطير المفضلة', en: 'Preferred Baking Texture' },
    bakingOptions: {
      standard: { ar: 'تسوية متوازنة (الافتراضي)', en: 'Balanced Golden (Standard)' },
      crispy: { ar: 'مقرمش زيادة', en: 'Extra Crispy' },
      soft: { ar: 'طري وخفيف', en: 'Soft & Tender' },
    },
    cutLabel: { ar: 'تفضيل التقطيع', en: 'Preferred Cutting Style' },
    cutOptions: {
      '8_slices': { ar: '٨ قطع (مثلثات / مربعات)', en: '8 Pieces' },
      '4_quarters': { ar: '٤ أرباع', en: '4 Quarters' },
      uncut: { ar: 'كامل بدون تقطيع', en: 'Whole (Uncut)' },
    },
    arrivalLabel: { ar: 'طريقة تسليم المندوب المفضلة', en: 'Courier Arrival Preference' },
    arrivalOptions: {
      call: { ar: 'الاتصال عند الوصول', en: 'Call upon arrival' },
      doorbell: { ar: 'رنة الجرس مباشرة', en: 'Ring doorbell directly' },
      doorman: { ar: 'التسليم للبواب', en: 'Leave with building concierge' },
    },
    defaultNotesLabel: { ar: 'ملاحظات افتراضية تضاف لكل طلب', en: 'Default Delivery Notes' },
    savePrefsBtn: { ar: 'حفظ التفضيلات الافتراضية', en: 'Save Preferences' },
    defaultTag: { ar: 'الافتراضي', en: 'Default' },
    setDefault: { ar: 'تعيين كافتراضي', en: 'Set Default' },
    edit: { ar: 'تعديل', en: 'Edit' },
    delete: { ar: 'حذف', en: 'Delete' },
    noAddresses: { ar: 'لم تقم بإضافة أي عناوين بعد. أضف عنوانك الأول أدناه.', en: 'No saved addresses yet. Add your first address below.' },
    noPhones: { ar: 'لم تقم بإضافة أرقام هواتف بعد.', en: 'No saved phone numbers yet.' },
    savedToast: { ar: 'تم الحفظ بنجاح', en: 'Saved successfully' },
    recentOrderTitle: { ar: 'أحدث طلب مسجل', en: 'Most Recent Order' },
    trackRecentBtn: { ar: 'متابعة الطلب', en: 'Track Order' },
  },
  kitchen: {
    navLabel: { ar: 'إدارة المطبخ وتأكيد الطلبات', en: 'Kitchen Stage Control' },
    title: { ar: 'تأكيد مراحل الطلبات (إدارة المطعم)', en: 'Restaurant Order Stage Control' },
    subtitle: {
      ar: 'تحكّم في تأكيد مراحل التحضير والتوصيل من هنا — وسيتحدث تتبع الطلب لدى العميل تلقائياً في نفس اللحظة.',
      en: 'Confirm preparation and delivery stages here — customer tracking screens update automatically in real time.',
    },
    emptyTitle: { ar: 'لا توجد طلبات مسجلة حالياً', en: 'No orders recorded yet' },
    emptyDesc: {
      ar: 'عند إتمام أي طلب سيظهر هنا لتأكيد مراحله، أو يمكنك إنشاء طلب تجريبي للاختبار.',
      en: 'Completed checkout orders appear here for stage confirmation, or create a sample order to test.',
    },
    createDemoBtn: { ar: 'إنشاء طلب تجريبي للاختبار', en: 'Create Sample Order' },
    openCustomerTrack: { ar: 'معاينة شاشة العميل', en: 'Open Customer Tracker' },
    confirmStagePrefix: { ar: 'تأكيد:', en: 'Confirm:' },
    pausedBadge: { ar: 'متوقف مؤقتاً', en: 'Paused' },
  },
  footer: {
    quickLinks: { ar: 'روابط سريعة', en: 'Quick Links' },
    contactInfo: { ar: 'بيانات التواصل', en: 'Contact Info' },
    openingHours: { ar: 'مواعيد العمل', en: 'Opening Hours' },
    copyright: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  },
};
