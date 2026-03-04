(function () {
  const mainHeader = document.querySelector(".header");
  const dynamicHeader = document.querySelector(".dynamic-header");
  const pageBody = document.body;

  if (!dynamicHeader || !mainHeader) return;

  let lastScrollY = window.scrollY;

  const getStickyTriggerPoint = () => {
    const viewportHeight = window.innerHeight;
    const maxScrollable =
      document.documentElement.scrollHeight - viewportHeight;

    // Use first fold on long pages; use a practical fallback on short pages.
    if (maxScrollable >= viewportHeight) {
      return viewportHeight;
    }

    return Math.max(140, maxScrollable * 0.25);
  };

  const updateDynamicHeader = () => {
    const currentScrollY = window.scrollY;
    const triggerPoint = getStickyTriggerPoint();
    const hasPassedFirstFold = currentScrollY > triggerPoint;
    const isScrollingUp = currentScrollY < lastScrollY - 2;
    const isScrollingDown = currentScrollY > lastScrollY + 2;
    const isAtTop = currentScrollY <= 0;

    if (!hasPassedFirstFold || isAtTop) {
      dynamicHeader.classList.remove("is-visible");
      mainHeader.classList.remove("is-hidden");
      pageBody.classList.remove("dynamic-header-active");
    } else {
      dynamicHeader.classList.add("is-visible");
      pageBody.classList.add("dynamic-header-active");

      if (isScrollingUp) {
        mainHeader.classList.remove("is-hidden");
        pageBody.style.setProperty(
          "--main-header-height",
          `${mainHeader.offsetHeight || 77}px`,
        );
      } else if (isScrollingDown) {
        mainHeader.classList.add("is-hidden");
        pageBody.style.setProperty("--main-header-height", "0px");
      }
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", updateDynamicHeader, { passive: true });
  window.addEventListener("resize", updateDynamicHeader);
  updateDynamicHeader();
})();

(function () {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((other) => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });
})();

(function () {
  const initHorizontalCarousel = (trackSelector, buttonSelector, cardSelector) => {
    const track = document.querySelector(trackSelector);
    const buttons = document.querySelectorAll(buttonSelector);

    if (!track || !buttons.length) return;

    const getScrollStep = () => {
      const firstCard = track.querySelector(cardSelector);
      if (!firstCard) return Math.max(280, Math.round(window.innerWidth * 0.28));

      const styles = getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
      return Math.round(firstCard.getBoundingClientRect().width + gap);
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.dataset.direction === "left" ? -1 : 1;
        track.scrollBy({
          left: direction * getScrollStep(),
          behavior: "smooth",
        });
      });
    });
  };

  initHorizontalCarousel(".applications-cards", ".applications-arrow", ".application-card");
  initHorizontalCarousel(".testimonial-cards", ".testimonial-arrow", ".testimonial-card");
})();

(function () {
  const gallery = document.querySelector(".hero-gallery");
  const mainImageWrap = gallery?.querySelector(".main-image");
  const mainImageStage = gallery?.querySelector(".main-image-stage");
  const lens = gallery?.querySelector(".zoom-lens");
  const preview = gallery?.querySelector(".zoom-preview");
  const previewImage = gallery?.querySelector(".zoom-preview-image");
  const thumbnailGallery = gallery?.querySelector(".thumbnail-gallery");
  const prevButton = gallery?.querySelector(".nav-btn.prev");
  const nextButton = gallery?.querySelector(".nav-btn.next");

  if (
    !gallery ||
    !mainImageWrap ||
    !mainImageStage ||
    !lens ||
    !preview ||
    !previewImage ||
    !thumbnailGallery ||
    !prevButton ||
    !nextButton
  ) {
    return;
  }

  const slides = [
    {
      src: "assets/images/hero.jpg",
      alt: "Product image 1",
    },
    {
      src: "assets/images/hero.jpg",
      alt: "Product image 2",
    },
    {
      src: "assets/images/hero.jpg",
      alt: "Product image 3",
    },
    {
      src: "assets/images/hero.jpg",
      alt: "Product image 4",
    },
    {
      src: "assets/images/hero.jpg",
      alt: "Product image 5",
    },
    {
      src: "assets/images/hero.jpg",
      alt: "Product image 6",
    },
  ];

  let activeIndex = 0;
  let isAnimating = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const setPreviewImage = (src) => {
    previewImage.style.backgroundImage = `url("${src}")`;
  };

  const renderThumbnails = () => {
    const markup = slides
      .map(
        (slide, index) => `
          <button
            class="thumbnail shadow-sm ${index === 0 ? "active" : ""}"
            type="button"
            aria-label="Open product image ${index + 1}"
            data-index="${index}"
            data-src="${slide.src}"
            style="--thumb-object-position: ${slide.objectPosition};"
          >
            <img src="${slide.src}" alt="${slide.alt}" />
          </button>
        `,
      )
      .join("");

    thumbnailGallery.innerHTML = markup;
  };

  const getCurrentImage = () => {
    return (
      mainImageStage.querySelector(".main-product-image.is-current") ||
      mainImageStage.querySelector(".main-product-image")
    );
  };

  const setActiveSlide = (index, direction = 1, instant = false) => {
    if (isAnimating && !instant) return;

    activeIndex = (index + slides.length) % slides.length;
    const current = slides[activeIndex];
    const currentImage = getCurrentImage();

    if (!currentImage) return;

    if (instant) {
      currentImage.src = current.src;
      currentImage.alt = current.alt;
      currentImage.style.objectPosition = current.objectPosition;
    } else {
      isAnimating = true;

      const incomingImage = document.createElement("img");
      incomingImage.className = "main-product-image slide-enter";
      incomingImage.src = current.src;
      incomingImage.alt = current.alt;
      incomingImage.style.objectPosition = current.objectPosition;
      incomingImage.style.transform = `translateX(${direction > 0 ? "100%" : "-100%"})`;
      incomingImage.style.transition = "transform 0.42s ease";

      currentImage.classList.add("slide-exit");
      currentImage.style.transition = "transform 0.42s ease";
      currentImage.style.transform = "translateX(0)";

      mainImageStage.appendChild(incomingImage);

      requestAnimationFrame(() => {
        incomingImage.style.transform = "translateX(0)";
        currentImage.style.transform = `translateX(${direction > 0 ? "-100%" : "100%"})`;
      });

      incomingImage.addEventListener(
        "transitionend",
        () => {
          currentImage.remove();
          incomingImage.classList.remove("slide-enter");
          incomingImage.classList.add("is-current");
          incomingImage.style.transition = "";
          incomingImage.style.transform = "";
          isAnimating = false;
        },
        { once: true },
      );
    }

    setPreviewImage(current.src);

    thumbnailGallery.querySelectorAll(".thumbnail").forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("active", thumbIndex === activeIndex);
    });
  };

  const setZoomPosition = (event, targetElement, showLens) => {
    const rect = targetElement.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);

    previewImage.style.backgroundPosition = `${x * 100}% ${y * 100}%`;

    if (showLens) {
      lens.style.left = `${x * 100}%`;
      lens.style.top = `${y * 100}%`;
      mainImageWrap.classList.add("is-zooming");
    } else {
      mainImageWrap.classList.remove("is-zooming");
    }
  };

  const showPreview = (src) => {
    setPreviewImage(src);
    preview.classList.add("is-visible");
    preview.setAttribute("aria-hidden", "false");
  };

  const hidePreview = () => {
    preview.classList.remove("is-visible");
    preview.setAttribute("aria-hidden", "true");
    mainImageWrap.classList.remove("is-zooming");
  };

  const isOverNavButton = (event) => {
    return Boolean(event?.target?.closest(".nav-btn"));
  };

  renderThumbnails();
  setActiveSlide(0, 1, true);

  prevButton.addEventListener("click", () => setActiveSlide(activeIndex - 1, -1));
  nextButton.addEventListener("click", () => setActiveSlide(activeIndex + 1, 1));

  thumbnailGallery.addEventListener("click", (event) => {
    const thumb = event.target.closest(".thumbnail");
    if (!thumb) return;

    const index = Number.parseInt(thumb.dataset.index || "0", 10);
    const direction = index >= activeIndex ? 1 : -1;
    setActiveSlide(index, direction);
  });

  mainImageWrap.addEventListener("mouseenter", (event) => {
    if (isOverNavButton(event)) {
      hidePreview();
      return;
    }
    showPreview(slides[activeIndex].src);
    setZoomPosition(event, mainImageWrap, true);
  });

  mainImageWrap.addEventListener("mousemove", (event) => {
    if (isOverNavButton(event)) {
      hidePreview();
      return;
    }
    showPreview(slides[activeIndex].src);
    setZoomPosition(event, mainImageWrap, true);
  });

  mainImageWrap.addEventListener("mouseleave", () => {
    hidePreview();
  });

  const disablePreviewOnNavHover = (button) => {
    button.addEventListener("mouseenter", hidePreview);
  };

  disablePreviewOnNavHover(prevButton);
  disablePreviewOnNavHover(nextButton);
})();
