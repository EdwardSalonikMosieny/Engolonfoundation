(function () {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const donationModal = document.querySelector("[data-donation-modal]");
  const donationDialog = donationModal ? donationModal.querySelector(".donation-dialog") : null;
  const donationOpeners = document.querySelectorAll("[data-donate-open]");
  const donationClosers = document.querySelectorAll("[data-donation-close]");
  const gallerySlider = document.querySelector("[data-gallery-slider]");
  const galleryTrack = document.querySelector("[data-gallery-track]");
  const gallerySlides = galleryTrack ? Array.from(galleryTrack.children) : [];
  const galleryPrev = document.querySelector("[data-gallery-prev]");
  const galleryNext = document.querySelector("[data-gallery-next]");
  const galleryDots = document.querySelector("[data-gallery-dots]");

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

  donationOpeners.forEach((button) => {
    button.addEventListener("click", openDonationModal);
  });

  donationClosers.forEach((button) => {
    button.addEventListener("click", closeDonationModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDonationModal();
  });

  if (gallerySlider && galleryTrack && gallerySlides.length) {
    let activeSlide = 0;
    let slideTimer = null;

    const dots = gallerySlides.map((slide, index) => {
      const dot = document.createElement("button");
      dot.className = "gallery-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Show gallery image ${index + 1}`);
      dot.addEventListener("click", () => {
        showSlide(index);
        restartSlider();
      });
      if (galleryDots) galleryDots.appendChild(dot);
      return dot;
    });

    const showSlide = (index) => {
      activeSlide = (index + gallerySlides.length) % gallerySlides.length;
      galleryTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeSlide);
      });
    };

    const nextSlide = () => showSlide(activeSlide + 1);
    const previousSlide = () => showSlide(activeSlide - 1);

    const restartSlider = () => {
      window.clearInterval(slideTimer);
      slideTimer = window.setInterval(nextSlide, 4500);
    };

    if (galleryNext) {
      galleryNext.addEventListener("click", () => {
        nextSlide();
        restartSlider();
      });
    }

    if (galleryPrev) {
      galleryPrev.addEventListener("click", () => {
        previousSlide();
        restartSlider();
      });
    }

    gallerySlider.addEventListener("mouseenter", () => window.clearInterval(slideTimer));
    gallerySlider.addEventListener("mouseleave", restartSlider);
    showSlide(0);
    restartSlider();
  }

})();
