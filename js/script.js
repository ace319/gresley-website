"use strict";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  const cleanUrl =
    `${window.location.pathname}${window.location.search}`;

  if (window.location.hash) {
    history.replaceState(null, "", cleanUrl);
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const scrollHero = document.querySelector(".scroll-hero");
  const openingVideo = document.getElementById("openingVideo");
  const soundToggle = document.getElementById("soundToggle");
  const soundToggleLabel = document.getElementById("soundToggleLabel");
  const skipIntro = document.getElementById("skipIntro");
  let heroProgress = 0;
  let heroExpanded = false;
  let touchStartY = 0;
  let soundIsOn = false;

  function sendVideoCommand(command, args = []) {
    if (!openingVideo || !openingVideo.contentWindow) {
      return;
    }

    openingVideo.contentWindow.postMessage(JSON.stringify({
      event: "command",
      func: command,
      args
    }), "*");
  }

  function updateVideoVolume() {
    if (!soundIsOn || !scrollHero) {
      return;
    }

    const heroHeight = Math.max(scrollHero.offsetHeight, 1);
    const scrollFade = Math.max(0, 1 - (window.scrollY / (heroHeight * 2.5)));
    const pageFade = 0.15 + (scrollFade * 0.85);
    const expansionLevel = 0.12 + (heroProgress * 0.88);
    const volume = Math.round(100 * expansionLevel * pageFade);

    sendVideoCommand("setVolume", [volume]);
  }

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      soundIsOn = !soundIsOn;
      sendVideoCommand(soundIsOn ? "unMute" : "mute");
      sendVideoCommand("playVideo");
      updateVideoVolume();
      soundToggle.setAttribute("aria-pressed", String(soundIsOn));
      soundToggle.setAttribute(
        "aria-label",
        soundIsOn ? "Turn video sound off" : "Turn video sound on"
      );

      if (soundToggleLabel) {
        soundToggleLabel.textContent = soundIsOn ? "Sound off" : "Sound on";
      }
    });
  }

  function renderHero() {
    if (!scrollHero) {
      return;
    }

    scrollHero.style.setProperty("--hero-progress", heroProgress.toFixed(3));
    scrollHero.classList.toggle("is-expanded", heroExpanded);
    updateVideoVolume();
  }

  function updateHero(delta) {
    heroProgress = Math.min(Math.max(heroProgress + delta, 0), 1);
    heroExpanded = heroProgress >= 1;
    renderHero();
  }

  if (scrollHero) {
    if (skipIntro) {
      skipIntro.addEventListener("click", () => {
        heroProgress = 1;
        heroExpanded = true;
        renderHero();

        document.getElementById("news")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }

    window.addEventListener("wheel", (event) => {
      const returningToHero = heroExpanded && event.deltaY < 0 && window.scrollY <= 5;

      if (returningToHero) {
        heroExpanded = false;
      }

      if (!heroExpanded) {
        event.preventDefault();
        window.scrollTo(0, 0);
        updateHero(event.deltaY * 0.00115);
      }
    }, { passive: false });

    window.addEventListener("touchstart", (event) => {
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchmove", (event) => {
      if (!touchStartY) {
        return;
      }

      const touchY = event.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const returningToHero = heroExpanded && deltaY < -20 && window.scrollY <= 5;

      if (returningToHero) {
        heroExpanded = false;
      }

      if (!heroExpanded) {
        event.preventDefault();
        window.scrollTo(0, 0);
        updateHero(deltaY * 0.006);
        touchStartY = touchY;
      }
    }, { passive: false });

    window.addEventListener("touchend", () => {
      touchStartY = 0;
    }, { passive: true });

    window.addEventListener("scroll", updateVideoVolume, { passive: true });

    renderHero();
  }

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
