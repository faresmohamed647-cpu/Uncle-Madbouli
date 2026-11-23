import {
  CATEGORIES,
  PRODUCTS,
  REVIEWS,
  SPECIAL_OFFERS,
  UI_TEXT,
  WHY_CHOOSE_US,
} from '../data.js';
import { addToCart } from '../cart.js';
import { formatPrice, getLang, t } from '../i18n.js';
import {
  bind3DTilt,
  bindProductCardActions,
  escapeHtml,
  getOrderEntryHref,
  initAppShell,
  renderImageWithFallback,
  renderProductCard,
  showToast,
} from '../ui.js';

function renderHome() {
  const lang = getLang();
  const root = document.getElementById('home-root');
  if (!root) return;

  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 6);

  root.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-split">
        <div class="hero-content">
          <p class="hero-kicker">${escapeHtml(t(UI_TEXT.hero.kicker, lang))}</p>
          <h1 class="hero-title">${escapeHtml(t(UI_TEXT.hero.headline, lang))}</h1>
          <p class="hero-desc">${escapeHtml(t(UI_TEXT.hero.desc, lang))}</p>
          <div class="hero-actions">
            <a href="${getOrderEntryHref()}" class="btn btn--primary btn--lg">${escapeHtml(t(UI_TEXT.hero.orderBtn, lang))}</a>
            <a href="/menu.html#catalog" class="btn btn--outline btn--lg">${escapeHtml(t(UI_TEXT.hero.exploreBtn, lang))}</a>
          </div>
          <div class="hero-highlights">
            ${UI_TEXT.hero.stats
              .map(
                (stat) => `
              <div>
                <span class="hero-stat__val tabular-nums">${escapeHtml(t(stat.val, lang))}</span>
                <span class="hero-stat__label">${escapeHtml(t(stat.label, lang))}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="hero-media tilt-3d">
          <img
            src="/images/hero_feteer_spread_1795352552586.jpg"
            alt="${escapeHtml(t(UI_TEXT.hero.headline, lang))}"
            referrerpolicy="no-referrer"
          />
          <div class="hero-3d-badge" aria-hidden="true">
            <span class="hero-3d-badge__title">${lang === 'ar' ? 'سمن بلدي ١٠٠٪' : '100% Baladi Ghee'}</span>
            <span class="hero-3d-badge__sub">${lang === 'ar' ? 'يُفرد ويُخبز طازجاً' : 'Hand-stretched fresh'}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <div class="section-header__copy">
            <p class="section-kicker">${escapeHtml(t(UI_TEXT.sections.categoriesKicker, lang))}</p>
            <h2 class="section-title">${escapeHtml(t(UI_TEXT.sections.categoriesTitle, lang))}</h2>
          </div>
        </div>
        <div class="categories-grid">
          ${CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.category === cat.id).length;
            return `
              <a href="/menu.html?category=${cat.id}" class="category-card tilt-3d">
                <div class="category-card__icon" aria-hidden="true">
                  <i class="${cat.icon}"></i>
                </div>
                <h3 class="category-card__name">${escapeHtml(t(cat.name, lang))}</h3>
                <span class="category-card__count tabular-nums">${count} ${escapeHtml(t(UI_TEXT.common.itemsCount, lang))}</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-header__copy">
            <p class="section-kicker">${escapeHtml(t(UI_TEXT.sections.bestSellersKicker, lang))}</p>
            <h2 class="section-title">${escapeHtml(t(UI_TEXT.sections.bestSellersTitle, lang))}</h2>
          </div>
          <a href="/menu.html" class="btn btn--outline">
            ${escapeHtml(t(UI_TEXT.sections.viewFullMenu, lang))}
          </a>
        </div>
        <div class="products-grid" id="best-sellers-grid">
          ${bestSellers.map((p) => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>

    <!-- Special Offers Section -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <div class="section-header__copy">
            <p class="section-kicker">${escapeHtml(t(UI_TEXT.sections.offersKicker, lang))}</p>
            <h2 class="section-title">${escapeHtml(t(UI_TEXT.sections.offersTitle, lang))}</h2>
          </div>
        </div>
        <div class="offers-grid">
          ${SPECIAL_OFFERS.map(
            (offer) => `
            <article class="offer-card">
              <div class="offer-card__media">
                ${renderImageWithFallback(offer.image, t(offer.title, lang))}
              </div>
              <div class="offer-card__body">
                <div>
                  <span class="product-card__meta">${escapeHtml(t(offer.badge, lang))}</span>
                  <h3 class="offer-card__title">${escapeHtml(t(offer.title, lang))}</h3>
                  <p class="product-card__desc">${escapeHtml(t(offer.description, lang))}</p>
                </div>
                <div class="offer-card__footer">
                  <div class="offer-card__pricing tabular-nums">
                    <span class="offer-card__new">${escapeHtml(formatPrice(offer.offerPrice, lang))}</span>
                    <span class="offer-card__old">${escapeHtml(formatPrice(offer.originalPrice, lang))}</span>
                  </div>
                  <button
                    type="button"
                    class="btn btn--primary btn--sm js-add-offer"
                    data-product-id="${offer.productId}"
                    data-size-id="${offer.defaultSizeId}"
                    data-offer-title="${escapeHtml(t(offer.title, lang))}"
                  >
                    ${escapeHtml(t(UI_TEXT.common.orderOffer, lang))}
                  </button>
                </div>
              </div>
            </article>
          `
          ).join('')}
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-header__copy">
            <p class="section-kicker">${escapeHtml(t(UI_TEXT.sections.whyKicker, lang))}</p>
            <h2 class="section-title">${escapeHtml(t(UI_TEXT.sections.whyTitle, lang))}</h2>
          </div>
        </div>
        <div class="pillars-grid">
          ${WHY_CHOOSE_US.map(
            (pillar) => `
            <article class="pillar-card tilt-3d">
              <div class="pillar-card__icon" aria-hidden="true">
                <i class="${pillar.icon}"></i>
              </div>
              <h3 class="pillar-card__title">${escapeHtml(t(pillar.title, lang))}</h3>
              <p class="pillar-card__desc">${escapeHtml(t(pillar.desc, lang))}</p>
            </article>
          `
          ).join('')}
        </div>
      </div>
    </section>

    <!-- Customer Reviews Section -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <div class="section-header__copy">
            <p class="section-kicker">${escapeHtml(t(UI_TEXT.sections.reviewsKicker, lang))}</p>
            <h2 class="section-title">${escapeHtml(t(UI_TEXT.sections.reviewsTitle, lang))}</h2>
          </div>
        </div>
        <div class="reviews-grid">
          ${REVIEWS.map(
            (rev) => `
            <article class="review-card">
              <div>
                <div class="review-stars" aria-label="5 out of 5 stars">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                </div>
                <p class="review-quote" style="margin-top: 12px;">“${escapeHtml(t(rev.quote, lang))}”</p>
              </div>
              <div class="review-author">
                <span class="review-author__name">${escapeHtml(t(rev.name, lang))}</span>
                <span class="review-author__meta">${escapeHtml(t(rev.area, lang))}</span>
              </div>
            </article>
          `
          ).join('')}
        </div>
      </div>
    </section>
  `;

  bindProductCardActions(root);
  bind3DTilt(root);

  root.querySelectorAll('.js-add-offer').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.getAttribute('data-product-id');
      const sizeId = btn.getAttribute('data-size-id');
      const offerTitle = btn.getAttribute('data-offer-title');
      addToCart({
        productId,
        sizeId,
        instructions: offerTitle,
        quantity: 1,
      });
      showToast(`${offerTitle} — ${t(UI_TEXT.common.addedToast, getLang())}`);
    });
  });
}

initAppShell('home', renderHome);
renderHome();
