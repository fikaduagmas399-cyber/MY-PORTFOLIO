(() => {
  "use strict";

  const STORAGE_KEY = "portfolio-theme";
  const THEME_ATTR = "data-theme";

  const toggleButton = document.getElementById("theme-toggle");
  const root = document.documentElement;

  if (!toggleButton) return;

  let isDark = root.getAttribute(THEME_ATTR) === "dark";

  toggleButton.setAttribute("aria-pressed", String(isDark));

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      
    }
  };

  toggleButton.addEventListener("click", () => {
    isDark = !isDark;

    if (isDark) {
      root.setAttribute(THEME_ATTR, "dark");
    } else {
      root.removeAttribute(THEME_ATTR);
    }

    toggleButton.setAttribute("aria-pressed", String(isDark));
    saveTheme(isDark ? "dark" : "light");
  });
})();

(() => {
  "use strict";

  const menuButton = document.getElementById("menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (!menuButton || !navigation) return;

  const FOCUSABLE_SELECTORS ='a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let focusableElements = [];
  let firstFocusable = null;
  let lastFocusable = null;

  const updateFocusableElements = () => {
    focusableElements = Array.from(
      navigation.querySelectorAll(FOCUSABLE_SELECTORS)
    );
    firstFocusable = focusableElements[0] || menuButton;
    lastFocusable = focusableElements[focusableElements.length - 1] || menuButton;
  };

  const handleKeyDown = (event) => {
    // 1. Close menu on Escape key press
    if (event.key === "Escape") {
      toggleMenu(false);
      menuButton.focus();
      return;
    }

    if (event.key === "Tab") {
      if (focusableElements.length === 0) return;

      const isShiftPressed = event.shiftKey;
      const activeElement = document.activeElement;

      if (isShiftPressed && activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!isShiftPressed && activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  const handleOutsideClick = (event) => {
    const isInside =
      navigation.contains(event.target) || menuButton.contains(event.target);

    if (!isInside) {
      toggleMenu(false);
    }
  };

  const toggleMenu = (isOpen) => {
    navigation.classList.toggle("is-active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      updateFocusableElements();
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);

      if (firstFocusable) {
        firstFocusable.focus();
      }
    } else {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    }
  };

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("is-active");
    toggleMenu(!isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggleMenu(false);
      menuButton.focus(); 
    }
  });
})();