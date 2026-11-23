import { BRAND_CONFIG, UI_TEXT } from "../data.js";
import { getLang, t } from "../i18n.js";
import { escapeHtml, initAppShell } from "../ui.js";

function renderAboutPage() {
  const lang = getLang();
  const root = document.getElementById("about-root");
  if (!root) return;

  const content = {
    title: { ar: "قصتنا في بيت الفطير", en: "Our Story at Feteer House" },
    subtitle: {
      ar: "نعيد إحياء حرفة الفطير المصري الأصيل بمكونات نقية وخبز طازج على الحجر كل يوم.",
      en: "Reviving authentic Egyptian Feteer craftsmanship with pure ingredients and fresh stone-hearth baking.",
    },
    storyHeading: {
      ar: "من دقيق الفلاحين والسمن البلدي إلى مائدتك",
      en: "From Artisanal Flour & Baladi Ghee to Your Table",
    },
    storyBody1: {
      ar: "بدأت حكاية بيت الفطير من شغف بسيط: كيف نقدم الفطير المصري الأصيل بنفس الجودة والطعم الذي نعرفه في بيوت الريف، ولكن بتغليف عصري وطلب أونلاين سهل يصل ساخناً أينما كنت.",
      en: "Feteer House began with a simple promise: to bring true Egyptian countryside feteer—hand-stretched to paper-thin layers and brushed with pure baladi ghee—into a modern, effortless online ordering experience.",
    },
    storyBody2: {
      ar: "نرفض العجائن الجاهزة أو الزيوت المهدرجة. كل فطيرة تبدأ بكرة عجين مستريحة وتُفرد يدوياً على رخام المخبز ثم تُخبز عند استلام طلبك مباشرة.",
      en: "We never use shortcuts or hydrogenated oils. Every dough ball rests naturally, gets stretched by hand across marble counters, and hits the hot stone oven only after you place your order.",
    },
    stepsTitle: {
      ar: "رحلة الفطيرة داخل مطبخنا",
      en: "How Every Feteer Is Crafted",
    },
    steps: [
      {
        num: "01",
        title: {
          ar: "العجن والتوريق اليدوي",
          en: "Hand Stretching & Layering",
        },
        desc: {
          ar: "نفرد العجين الطازج حتى يصبح شفافاً ونطويه في أكثر من ٣٢ طبقة مع السمن البلدي الصافي.",
          en: "Fresh dough is hand-stretched translucent thin and folded into 32+ airy layers with pure baladi ghee.",
        },
      },
      {
        num: "02",
        title: { ar: "الحشو السخي والطازج", en: "Generous Fresh Fillings" },
        desc: {
          ar: "سجق بلدي متبل، بسطرمة فاخرة، أجبان طبيعية أو قشطة وعسل نحل منتقى بعناية.",
          en: "Spiced local sausage, cured pastrami, natural cheeses, or fresh clotted cream and wildflower honey.",
        },
      },
      {
        num: "03",
        title: {
          ar: "الخبز الحجري والتوصيل",
          en: "Stone-Hearth Bake & Delivery",
        },
        desc: {
          ar: "تُخبز على حرارة عالية لتنتفخ وتتحمر من الخارج مع قلب طري، وتنطلق فوراً في علب حرارية.",
          en: "High-heat stone baking seals crisp golden edges around a tender center before insulated dispatch.",
        },
      },
    ],
  };

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">${escapeHtml(t(content.title, lang))}</h1>
        <p class="page-banner__subtitle">${escapeHtml(t(content.subtitle, lang))}</p>
      </div>
    </section>

    <section class="section">
      <div class="container story-split">
        <div>
          <p class="section-kicker">${escapeHtml(t(BRAND_CONFIG.name, lang))}</p>
          <h2 class="section-title">${escapeHtml(t(content.storyHeading, lang))}</h2>
          <p style="color: var(--color-text-muted); margin-bottom: 16px;">${escapeHtml(t(content.storyBody1, lang))}</p>
          <p style="color: var(--color-text-muted); margin-bottom: 24px;">${escapeHtml(t(content.storyBody2, lang))}</p>
          <a href="/menu.html" class="btn btn--primary btn--lg">${escapeHtml(t(UI_TEXT.hero.exploreBtn, lang))}</a>
        </div>
        <div class="story-media">
          <img
            src="/images/bakery_craftsmanship_1795352552875.jpg"
            alt="${escapeHtml(t(content.storyHeading, lang))}"
            referrerpolicy="no-referrer"
          />
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${escapeHtml(t(content.stepsTitle, lang))}</h2>
        </div>
        <div class="steps-grid">
          ${content.steps
            .map(
              (st) => `
            <article class="step-card">
              <div class="step-num tabular-nums">${st.num}</div>
              <h3 class="pillar-card__title" style="margin-bottom: 8px;">${escapeHtml(t(st.title, lang))}</h3>
              <p class="pillar-card__desc">${escapeHtml(t(st.desc, lang))}</p>
            </article>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function mountLegacyPage() {
  initAppShell("about", renderAboutPage);
  renderAboutPage();
}
