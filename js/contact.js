// contact.js - Contact form validation
// Rules: no empty fields, valid email format, phone = digits only.

(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");

  var fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    message: document.getElementById("message")
  };

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var digitsOnly = /^\d+$/;

  // Returns an error string, or "" when the value is valid
  function validate(fieldName, value) {
    value = value.trim();
    if (value === "") return "This field cannot be empty.";

    if (fieldName === "email" && !emailPattern.test(value)) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }
    if (fieldName === "phone" && !digitsOnly.test(value)) {
      return "Phone number must contain digits only (0-9).";
    }
    return "";
  }

  function showResult(fieldName) {
    var input = fields[fieldName];
    var wrapper = input.closest(".field");
    var errorEl = document.getElementById(fieldName + "-error");
    var message = validate(fieldName, input.value);

    errorEl.textContent = message;
    wrapper.classList.toggle("invalid", message !== "");
    wrapper.classList.toggle("valid", message === "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
    return message === "";
  }

  // Live validation while the user types / leaves a field
  Object.keys(fields).forEach(function (fieldName) {
    fields[fieldName].addEventListener("blur", function () { showResult(fieldName); });
    fields[fieldName].addEventListener("input", function () {
      success.classList.remove("show");
      if (fields[fieldName].closest(".field").classList.contains("invalid")) showResult(fieldName);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var allValid = true;
    var firstInvalid = null;

    Object.keys(fields).forEach(function (fieldName) {
      var ok = showResult(fieldName);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = fields[fieldName];
      }
    });

    if (!allValid) {
      success.classList.remove("show");
      firstInvalid.focus();
      return;
    }

    // Simulated send (no backend). Replace with Formspree/EmailJS for real delivery.
    var firstName = fields.name.value.trim().split(" ")[0];
    success.textContent = "Thank you, " + firstName + "! Your message has been sent successfully.";
    success.classList.add("show");

    form.reset();
    Object.keys(fields).forEach(function (fieldName) {
      fields[fieldName].closest(".field").classList.remove("valid", "invalid");
    });
  });
})();