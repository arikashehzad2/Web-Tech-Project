// public/js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelectorAll(".main-nav a");

  // Close menu when clicking a link (mobile UX improvement)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (menuToggle) menuToggle.checked = false;
    });
  });
});
