(function () {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const donationModal = document.querySelector("[data-donation-modal]");
  const donationDialog = donationModal ? donationModal.querySelector(".donation-dialog") : null;
  const donationOpeners = document.querySelectorAll("[data-donate-open]");
  const donationClosers = document.querySelectorAll("[data-donation-close]");
  const lightboxModal = document.querySelector("[data-lightbox-modal]");
  const lightboxDialog = lightboxModal ? lightboxModal.querySelector(".lightbox-dialog") : null;
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxCaption = document.querySelector("[data-lightbox-caption]");
  const lightboxOpeners = Array.from(document.querySelectorAll("[data-lightbox-open]"));
  const lightboxClosers = document.querySelectorAll("[data-lightbox-close]");
  const lightboxPrev = document.querySelector("[data-lightbox-prev]");
  const lightboxNext = document.querySelector("[data-lightbox-next]");
  let activeLightboxIndex = 0;

  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      menu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    });
  });

  const handleHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", handleHeader, { passive: true });
  handleHeader();

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const stat = entry.target;
      const target = Number(stat.dataset.count);
      if (!target || stat.dataset.done) return;
      stat.dataset.done = "true";
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = target >= 100 ? `${current}+` : current;
      }, 24);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll("[data-count]").forEach((stat) => statObserver.observe(stat));

  const openDonationModal = () => {
    if (!donationModal) return;
    donationModal.classList.add("is-open");
    donationModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (donationDialog) donationDialog.focus();
  };

  const closeDonationModal = () => {
    if (!donationModal) return;
    donationModal.classList.remove("is-open");
    donationModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const showLightboxImage = (index) => {
    if (!lightboxImage || !lightboxOpeners.length) return;
    activeLightboxIndex = (index + lightboxOpeners.length) % lightboxOpeners.length;
    const image = lightboxOpeners[activeLightboxIndex].querySelector("img");
    if (!image) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    if (lightboxCaption) lightboxCaption.textContent = image.alt;
  };

  const openLightbox = (index) => {
    if (!lightboxModal) return;
    showLightboxImage(index);
    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (lightboxDialog) lightboxDialog.focus();
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("is-open");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const showPreviousLightboxImage = () => showLightboxImage(activeLightboxIndex - 1);
  const showNextLightboxImage = () => showLightboxImage(activeLightboxIndex + 1);

  donationOpeners.forEach((button) => {
    button.addEventListener("click", openDonationModal);
  });

  donationClosers.forEach((button) => {
    button.addEventListener("click", closeDonationModal);
  });

  lightboxOpeners.forEach((button, index) => {
    button.addEventListener("click", () => openLightbox(index));
  });

  lightboxClosers.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  if (lightboxPrev) lightboxPrev.addEventListener("click", showPreviousLightboxImage);
  if (lightboxNext) lightboxNext.addEventListener("click", showNextLightboxImage);

  document.addEventListener("keydown", (event) => {
    const isLightboxOpen = lightboxModal && lightboxModal.classList.contains("is-open");
    if (event.key === "Escape") {
      closeDonationModal();
      closeLightbox();
    }
    if (!isLightboxOpen) return;
    if (event.key === "ArrowLeft") showPreviousLightboxImage();
    if (event.key === "ArrowRight") showNextLightboxImage();
  });

})();
