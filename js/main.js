// main.js - shared behaviour for every page

document.addEventListener("DOMContentLoaded", function () {
  // ---- Mobile navigation toggle ----
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "\u2715" : "\u2630";
    });
  }

  // ---- Highlight the current page in the menu ----
  var current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === current) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // ---- Footer year (dynamic content) ----
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---- Time-based welcome greeting (homepage) ----
  var greeting = document.getElementById("greeting");
  if (greeting) {
    var hour = new Date().getHours();
    var text = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    greeting.textContent = text + " \uD83D\uDC4B and welcome!";
  }

  // ---- Animate skill bars when they scroll into view ----
  var fills = document.querySelectorAll(".bar-fill");
  if (fills.length) {
    var animate = function (el) {
      el.style.width = el.getAttribute("data-level") + "%";
    };
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      fills.forEach(function (f) { observer.observe(f); });
    } else {
      fills.forEach(animate);
    }
  }

  // ---- Project filter buttons (projects page) ----
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projects = document.querySelectorAll(".project");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var category = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      projects.forEach(function (p) {
        var match = category === "all" || p.getAttribute("data-category") === category;
        p.classList.toggle("hidden", !match);
      });
    });
  });
});