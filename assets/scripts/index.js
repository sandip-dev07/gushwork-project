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
