(() => {
  const dictionary = window.translations || {};
  const languageKey = "preferredLanguage";
  const currentFile = location.pathname.split("/").pop() || "index.html";
  let language = "en";
  try { language = localStorage.getItem(languageKey) || "en"; } catch {}
  if (!dictionary[language]) language = "en";
  const menuButton = document.querySelector(".menu-toggle");

  const applyLanguage = (nextLanguage) => {
    if (!dictionary[nextLanguage]) return;
    language = nextLanguage;
    try { localStorage.setItem(languageKey, language); } catch {}
    document.documentElement.lang = language === "ta" ? "ta" : "en";
    document.querySelectorAll("[data-lang]").forEach((element) => {
      element.hidden = element.dataset.lang !== language;
    });
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = dictionary[language][element.dataset.i18n];
      if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const [attribute, key] = element.dataset.i18nAttr.split(":");
      const value = dictionary[language][key];
      if (attribute && value !== undefined) element.setAttribute(attribute, value);
    });
    document.querySelectorAll("[data-meta-en]").forEach((element) => {
      element.content = language === "ta" ? element.dataset.metaTa : element.dataset.metaEn;
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      const selected = button.dataset.language === language;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-current", selected);
    });
    document.querySelectorAll("[data-dynamic-image-alt]").forEach((image) => {
      image.alt = dictionary[language][image.dataset.dynamicImageAlt] || "";
    });
    document.querySelectorAll("[data-person-image]").forEach((image) => {
      const card = image.closest("[data-person]");
      const person = window.trustData?.[card?.dataset.person];
      const role = dictionary[language][card?.dataset.person];
      if (person) image.alt = `${role}: ${person.name}`;
    });
    document.querySelectorAll("[data-dynamic-content]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    const trustName = language === "ta" ? window.trustData?.tamilName : window.trustData?.name;
    document.querySelectorAll(".brand-name, .footer-brand").forEach((element) => {
      if (trustName) element.textContent = trustName;
    });
    const titleKeys = {
      "index.html": "titleHome",
      "about.html": "titleAbout",
      "ramanujar.html": "titleRamanujar",
      "activities.html": "titleActivities",
      "gallery.html": "titleGallery",
      "contact.html": "titleContact"
    };
    if (dictionary[language][titleKeys[currentFile]]) document.title = dictionary[language][titleKeys[currentFile]];
    const languageControl = document.querySelector(".language-switch");
    if (languageControl) languageControl.setAttribute("aria-label", dictionary[language].chooseLanguage);
    if (menuButton) menuButton.setAttribute("aria-label", dictionary[language].toggleNavigation);
  };

  document.querySelectorAll("[data-person]").forEach((card) => {
    const person = window.trustData?.[card.dataset.person];
    if (!person) return;
    const name = card.querySelector("[data-person-name]");
    const qualification = card.querySelector("[data-person-qualification]");
    const portrait = card.querySelector("[data-person-image]");
    if (name) name.textContent = person.name;
    if (qualification) qualification.textContent = person.qualification;
    if (portrait && person.photo) portrait.src = person.photo;
  });

  document.querySelectorAll("[data-trust-field]").forEach((element) => {
    const value = element.dataset.trustField.split(".").reduce((data, key) => data?.[key], window.trustData);
    if (typeof value === "string") element.textContent = value;
  });

  const galleryGrid = document.querySelector("[data-gallery-grid]");
  if (galleryGrid && window.trustData?.images) {
    window.trustData.images.forEach((entry) => {
      const link = document.createElement("a");
      link.className = "gallery-item";
      link.href = entry.src;
      link.dataset.lightbox = "";
      const image = document.createElement("img");
      image.src = entry.src;
      image.alt = dictionary[language][entry.altKey] || "";
      image.dataset.dynamicImageAlt = entry.altKey;
      image.loading = "lazy";
      image.decoding = "async";
      link.append(image);
      galleryGrid.append(link);
    });
  }

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });
  applyLanguage(language);

  const nav = document.querySelector(".primary-nav");
  if (menuButton && nav) {
    if (!nav.id) nav.id = "primary-navigation";
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll(".primary-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentFile) {
      link.setAttribute("aria-current", "page");
      link.classList.add("is-active");
    }
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const items = [...document.querySelectorAll("[data-lightbox]")];
    const image = lightbox.querySelector("img");
    const caption = lightbox.querySelector(".lightbox-caption");
    let activeIndex = 0;
    const showImage = (index) => {
      activeIndex = (index + items.length) % items.length;
      const source = items[activeIndex];
      image.src = source.href;
      image.alt = source.querySelector("img").alt;
      caption.textContent = image.alt;
    };
    const close = () => {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
    };
    items.forEach((item, index) => item.addEventListener("click", (event) => {
      event.preventDefault();
      showImage(index);
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lightbox.querySelector("[data-lightbox-close]").focus();
    }));
    lightbox.querySelector("[data-lightbox-close]").addEventListener("click", close);
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => showImage(activeIndex - 1));
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => showImage(activeIndex + 1));
    lightbox.addEventListener("click", (event) => { if (event.target === lightbox) close(); });
    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showImage(activeIndex - 1);
      if (event.key === "ArrowRight") showImage(activeIndex + 1);
    });
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector("[role=status]");
      if (!form.reportValidity()) {
        status.textContent = dictionary[language].formRequired;
        status.classList.add("form-error");
        return;
      }
      status.textContent = dictionary[language].formReady;
      status.classList.remove("form-error");
      form.reset();
    });
  }

  const backTop = document.querySelector(".back-to-top");
  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
