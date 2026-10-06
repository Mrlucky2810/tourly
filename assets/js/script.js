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
  if (window.scrollY >= 200) {
    if (header) header.classList.add("active");
    if (goTopBtn) goTopBtn.classList.add("active");
  } else {
    if (header) header.classList.remove("active");
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
      const dest = formData.get("destination") || "Any Destination";
      const pax = formData.get("people") || "1";
      const checkin = formData.get("checkin") || "Flexible";
      const checkout = formData.get("checkout") || "Flexible";
      msg += `📍 Destination: ${dest}\n👥 Travelers: ${pax}\n📅 Check-in: ${checkin}\n📅 Check-out: ${checkout}`;
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