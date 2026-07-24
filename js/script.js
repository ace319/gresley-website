"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton =
    document.getElementById("menuButton");

  const mainNavigation =
    document.getElementById("mainNavigation");

  const navigationLinks =
    document.querySelectorAll("#mainNavigation a");

  const backToTopButton =
    document.getElementById("backToTop");

  const currentYear =
    document.getElementById("currentYear");

  const showArchiveButton =
    document.getElementById("showArchiveButton");

  const showArchive =
    document.getElementById("showArchive");

  const showArchiveLabel =
    document.getElementById("showArchiveLabel");

  if (currentYear) {
    currentYear.textContent =
      `© ${new Date().getFullYear()}`;
  }

  function closeMenu() {
    if (!menuButton || !mainNavigation) {
      return;
    }

    menuButton.classList.remove("active");
    mainNavigation.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  }

  if (menuButton && mainNavigation) {
    menuButton.addEventListener("click", () => {
      const menuIsOpen =
        mainNavigation.classList.toggle("open");

      menuButton.classList.toggle(
        "active",
        menuIsOpen
      );

      document.body.classList.toggle(
        "menu-open",
        menuIsOpen
      );

      menuButton.setAttribute(
        "aria-expanded",
        String(menuIsOpen)
      );

      menuButton.setAttribute(
        "aria-label",
        menuIsOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );
    });
  }

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  if (showArchiveButton && showArchive) {
    showArchiveButton.addEventListener("click", () => {
      const archiveIsOpen =
        !showArchive.hasAttribute("hidden");

      if (archiveIsOpen) {
        showArchive.setAttribute("hidden", "");

        if (showArchiveLabel) {
          showArchiveLabel.textContent =
            "Total shows — click to view";
        }
      } else {
        showArchive.removeAttribute("hidden");

        if (showArchiveLabel) {
          showArchiveLabel.textContent =
            "Total shows — click to hide";
        }

        window.setTimeout(() => {
          showArchive.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }

      showArchiveButton.setAttribute(
        "aria-expanded",
        String(!archiveIsOpen)
      );
    });
  }

  function updateBackToTopButton() {
    if (!backToTopButton) {
      return;
    }

    if (window.scrollY > 500) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  }

  window.addEventListener(
    "scroll",
    updateBackToTopButton,
    { passive: true }
  );

  updateBackToTopButton();

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
