'use strict';

/**
 * Navbar Toggle & Active Page Marker
 */
const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

if (navOpenBtn && navbar && overlay) {
  for (let i = 0; i < navElemArr.length; i++) {
    if (navElemArr[i]) {
      navElemArr[i].addEventListener("click", function () {
        navbar.classList.toggle("active");
        overlay.classList.toggle("active");
      });
    }
  }
}

// Highlight current page active link
const currentPath = window.location.pathname.split("/").pop() || "index.html";
navLinks.forEach(link => {
  const href = link.getAttribute("href");
  if (href === currentPath || (currentPath === "" && href === "index.html")) {
    link.classList.add("active");
  }
});

/**
 * Header Sticky & Go To Top
 */
const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 150) {
    if (header) header.classList.add("active");
    if (goTopBtn) goTopBtn.classList.add("active");
  } else {
    if (header && !header.hasAttribute("data-header-fixed")) {
      header.classList.remove("active");
    }
    if (goTopBtn) goTopBtn.classList.remove("active");
  }
});

/**
 * Search Modal Toggle
 */
const searchBtns = document.querySelectorAll(".search-btn");
const searchModal = document.querySelector("[data-search-modal]");
const searchCloseBtn = document.querySelector("[data-search-close]");

if (searchModal) {
  searchBtns.forEach(btn => {
    btn.addEventListener("click", () => searchModal.classList.add("active"));
  });
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", () => searchModal.classList.remove("active"));
  }
  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) searchModal.classList.remove("active");
  });
}

/**
 * FAQ Accordion Toggle
 */
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach(item => {
  const title = item.querySelector(".faq-title");
  if (title) {
    title.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach(i => i.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  }
});

/**
 * Filter Buttons (Destinations & Gallery)
 */
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterCards = document.querySelectorAll("[data-filter-card]");

filterBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    filterBtns.forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    const category = this.dataset.filterBtn;
    filterCards.forEach(card => {
      if (category === "all" || card.dataset.filterCategory === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

/**
 * Gallery Lightbox
 */
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImg = document.querySelector("[data-lightbox-img]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const galleryItems = document.querySelectorAll(".gallery-image");

if (lightbox && galleryItems.length > 0) {
  galleryItems.forEach(item => {
    item.addEventListener("click", function () {
      const img = this.querySelector("img");
      if (img) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt || "Tourly Gallery Image";
        lightbox.classList.add("active");
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => lightbox.classList.remove("active"));
  }
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("active");
  });
}

/**
 * WhatsApp Redirect & Form Interactivity
 */
const WA_PHONE = "10123456790";

function sendToWhatsApp(messageText) {
  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(messageText)}`;
  window.open(url, "_blank");
}

// Global WhatsApp Inquire Buttons
document.querySelectorAll("[data-wa-inquire]").forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const item = this.dataset.waInquire || "Tourly Vacation Packages";
    sendToWhatsApp(`Hello Tourly! I am interested in inquiring about: ${item}. Please share more details and availability.`);
  });
});

// Form Submissions -> Redirect to WhatsApp
const forms = document.querySelectorAll("form");
forms.forEach(form => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check form type
    const formData = new FormData(this);
    let msg = "Hello Tourly Travel Agency! I have an inquiry:\n";

    if (this.classList.contains("tour-search-form")) {
      const rawDest = (formData.get("destination") || "").trim();
      const pax = formData.get("people") || "1";
      const checkin = formData.get("checkin") || "Flexible";
      const checkout = formData.get("checkout") || "Flexible";
      const dest = rawDest || "Sacred Pilgrimages & Yatras";

      msg += `📍 Destination: ${dest}\n👥 Travelers: ${pax}\n📅 Check-in: ${checkin}\n📅 Check-out: ${checkout}`;

      // On-page search matching: find matching cards and smooth scroll
      if (rawDest) {
        const query = rawDest.toLowerCase();
        const normalize = q => {
          if (q.includes("vanra") || q.includes("varan") || q.includes("kashi") || q.includes("banar")) return "varanasi";
          if (q.includes("ayodh") || q.includes("ram")) return "ayodhya";
          if (q.includes("kedar")) return "kedarnath";
          if (q.includes("badri")) return "badrinath";
          if (q.includes("prayag") || q.includes("allahabad")) return "prayagraj";
          return q;
        };
        const searchKey = normalize(query);

        const allCards = document.querySelectorAll(".popular-card, .package-card, .place-card, .package-grid-card");
        let matchedCard = null;

        allCards.forEach(card => {
          const cardText = card.textContent.toLowerCase();
          if (cardText.includes(query) || cardText.includes(searchKey)) {
            if (!matchedCard) matchedCard = card;
            card.classList.add("card-search-highlight");
            setTimeout(() => card.classList.remove("card-search-highlight"), 4000);
          }
        });

        if (matchedCard) {
          matchedCard.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const targetSection = document.getElementById("package") || document.getElementById("destination");
          if (targetSection) targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        const targetSection = document.getElementById("package") || document.getElementById("destination");
        if (targetSection) targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      sendToWhatsApp(msg);
      return;
    } else if (this.id === "package-booking-form") {
      const title = document.getElementById("pkg-title")?.textContent || "Package Booking";
      const date = document.getElementById("travel-date")?.value || "Flexible";
      const guests = document.getElementById("guest-count")?.value || "1";
      const email = document.getElementById("guest-email")?.value || "";
      const phone = document.getElementById("guest-phone")?.value || "";
      const total = document.getElementById("summary-total")?.textContent || "";
      msg += `📦 Package: ${title}\n📅 Date: ${date}\n👥 Guests: ${guests}\n📧 Email: ${email}\n📞 Phone: ${phone}`;
    } else if (this.id === "destination-inquiry-form") {
      const title = document.getElementById("dest-title")?.textContent || "Destination Inquiry";
      const month = document.getElementById("dest-date")?.value || "Flexible Month";
      const pax = document.getElementById("dest-pax")?.value || "1";
      const email = document.getElementById("dest-email")?.value || "";
      const phone = document.getElementById("dest-phone")?.value || "";
      msg += `🏖️ Destination: ${title}\n📅 Travel Month: ${month}\n👥 Guests: ${pax}\n📧 Email: ${email}\n📞 Phone: ${phone}`;
    } else if (formData.has("fullname") || formData.has("message")) {
      const name = formData.get("fullname") || "Traveler";
      const email = formData.get("email") || "";
      const phone = formData.get("phone") || "";
      const dest = formData.get("destination") || "General Inquiry";
      const userMsg = formData.get("message") || "";
      msg += `👤 Name: ${name}\n📧 Email: ${email}\n📞 Phone: ${phone}\n📍 Preferred Destination: ${dest}\n💬 Message: ${userMsg}`;
    } else if (formData.has("email")) {
      msg += `📧 Newsletter Subscription Request: ${formData.get("email")}`;
    } else {
      msg += "I would like to inquire about your travel services.";
    }

    sendToWhatsApp(msg);
  });
});

/**
 * Word Scroll Animation for Buttons (scrolls all words together simultaneously)
 * Applies to all existing buttons and automatically to any newly added buttons.
 */
function initButtonWordRoll() {
  const btnSelector = '.btn, .promo-btn, .packages-view-all, .gallery-view-all, .newsletter-submit-btn, [data-btn-roll]';

  const applyRollToButton = (btn) => {
    if (!btn || !(btn instanceof Element)) return;

    // Skip if already converted or contains form controls
    if (btn.querySelector('.btn-roll') || btn.querySelector('input') || btn.querySelector('select') || btn.querySelector('textarea')) {
      return;
    }

    // Skip utility icon-only controls
    if (btn.classList.contains('nav-close-btn') || btn.classList.contains('nav-open-btn') || 
        btn.classList.contains('search-btn') || btn.classList.contains('places-nav-btn') ||
        btn.classList.contains('go-top') || btn.classList.contains('whatsapp-float')) {
      return;
    }

    // 1. Direct text nodes
    const textNodes = Array.from(btn.childNodes).filter(
      node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
    );

    if (textNodes.length > 0) {
      const fullText = textNodes.map(n => n.textContent.trim()).join(' ');

      if (fullText.length > 0) {
        const rollWrapper = document.createElement('span');
        rollWrapper.className = 'btn-roll';
        rollWrapper.innerHTML = `
          <span class="btn-roll-text">${fullText}</span>
          <span class="btn-roll-text" aria-hidden="true">${fullText}</span>
        `;

        textNodes[0].replaceWith(rollWrapper);
        for (let i = 1; i < textNodes.length; i++) {
          textNodes[i].remove();
        }
        return;
      }
    }

    // 2. Text wrapped inside a simple child <span> (e.g. <span>Explore Deals</span>)
    const childSpans = Array.from(btn.children).filter(el => 
      el.tagName === 'SPAN' && 
      !el.classList.contains('btn-roll') && 
      !el.classList.contains('btn-arrow-circle') && 
      !el.classList.contains('view-all-circle') && 
      !el.querySelector('ion-icon')
    );

    if (childSpans.length === 1 && childSpans[0].textContent.trim().length > 0) {
      const fullText = childSpans[0].textContent.trim();
      const rollWrapper = document.createElement('span');
      rollWrapper.className = 'btn-roll';
      rollWrapper.innerHTML = `
        <span class="btn-roll-text">${fullText}</span>
        <span class="btn-roll-text" aria-hidden="true">${fullText}</span>
      `;
      childSpans[0].replaceWith(rollWrapper);
    }
  };

  document.querySelectorAll(btnSelector).forEach(applyRollToButton);

  // Setup MutationObserver so ANY button added to the page in the future automatically receives the animation
  if (!window._btnRollObserverSetup && typeof MutationObserver !== 'undefined') {
    window._btnRollObserverSetup = true;
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches && node.matches(btnSelector)) {
              applyRollToButton(node);
            }
            if (node.querySelectorAll) {
              node.querySelectorAll(btnSelector).forEach(applyRollToButton);
            }
          }
        });
      });
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initButtonWordRoll);
} else {
  initButtonWordRoll();
}

/**
 * Top Places Carousel Controls
 */
const placesTrack = document.querySelector("[data-places-track]");
const placesPrevBtn = document.querySelector("[data-places-prev]");
const placesNextBtn = document.querySelector("[data-places-next]");

if (placesTrack && placesPrevBtn && placesNextBtn) {
  const getScrollStep = () => {
    const firstCard = placesTrack.querySelector(".place-card");
    return firstCard ? firstCard.offsetWidth + 22 : 302;
  };

  const updatePlacesNavState = () => {
    const isAtStart = placesTrack.scrollLeft <= 8;
    const isAtEnd = placesTrack.scrollLeft + placesTrack.clientWidth >= placesTrack.scrollWidth - 8;
    placesPrevBtn.style.opacity = isAtStart ? "0.45" : "1";
    placesPrevBtn.style.pointerEvents = isAtStart ? "none" : "auto";
    placesNextBtn.style.opacity = isAtEnd ? "0.45" : "1";
    placesNextBtn.style.pointerEvents = isAtEnd ? "none" : "auto";
  };

  placesPrevBtn.addEventListener("click", () => {
    placesTrack.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
  });

  placesNextBtn.addEventListener("click", () => {
    placesTrack.scrollBy({ left: getScrollStep(), behavior: "smooth" });
  });

  placesTrack.addEventListener("scroll", updatePlacesNavState, { passive: true });
  window.addEventListener("resize", updatePlacesNavState);
  updatePlacesNavState();
}