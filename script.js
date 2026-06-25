const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const contactForm = document.querySelector("#contact-form");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const messages = {
  firstName: "Please enter your first name.",
  lastName: "Please enter your last name.",
  email: "Please enter a valid email address.",
  phone: "Please enter a phone number.",
  requesterType: "Please select the option that best describes you.",
  subject: "Please enter a subject.",
  message: "Please enter a message.",
  consent: "Consent is required before we can contact you."
};

function setFieldError(field, message) {
  const error = document.querySelector(`[data-error-for="${field.name}"]`);
  const wrapper = field.closest(".form-field") || field.closest(".checkbox-field");

  if (wrapper) {
    wrapper.classList.toggle("has-error", Boolean(message));
  }

  field.setAttribute("aria-invalid", message ? "true" : "false");

  if (error) {
    error.textContent = message || "";
  }
}

function validateField(field) {
  let message = "";

  if (field.validity.valueMissing || (field.type === "checkbox" && !field.checked)) {
    message = messages[field.name] || "This field is required.";
  } else if (field.type === "email" && field.validity.typeMismatch) {
    message = messages.email;
  }

  setFieldError(field, message);
  return !message;
}

if (contactForm) {
  const fields = Array.from(contactForm.querySelectorAll("input, select, textarea"));
  const successMessage = contactForm.querySelector(".form-success");

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const validationResults = fields.map((field) => validateField(field));
    const isValid = validationResults.every(Boolean);

    if (!isValid) {
      const firstInvalid = fields.find((field) => field.getAttribute("aria-invalid") === "true");
      firstInvalid?.focus();
      return;
    }

    const formData = Object.fromEntries(new FormData(contactForm).entries());
    formData.consent = contactForm.consent.checked;
    formData.sourcePage = window.location.pathname || "/";

    /*
      Future Back4App / Parse integration point:
      Send formData to a Parse Cloud Code function or a locked-down Parse class.
      Do not put Parse master keys or other secrets in frontend code.
      See BACK4APP_FORM_INTEGRATION.md for the expected fields and security notes.
    */
    console.info("Contact form ready for future Back4App submission", formData);

    contactForm.reset();
    fields.forEach((field) => setFieldError(field, ""));

    if (successMessage) {
      successMessage.hidden = false;
    }
  });
}
