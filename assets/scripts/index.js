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
