// public/js/menu.js

function showMenu(category) {
  document.querySelectorAll(".menu-items").forEach(el => {
    el.style.display = "none";
  });

  const selected = document.getElementById(category);
  if (selected) {
    selected.style.display = "block";
  }
}

// Show default category on page load
document.addEventListener("DOMContentLoaded", () => {
  showMenu("bites");
});
