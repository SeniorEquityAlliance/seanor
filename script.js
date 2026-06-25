const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const contactForm = document.querySelector("#contact-form");
const CONTACT_FORM_ENDPOINT = window.SEA_CONTACT_FORM_ENDPOINT || "";

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
  const errorMessage = contactForm.querySelector(".form-error");
  const submitButton = contactForm.querySelector(".form-submit");

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    successMessage.hidden = true;
    errorMessage.hidden = true;

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
    formData.parseClass = contactForm.dataset.parseClass || "ContactSubmission";

    if (!CONTACT_FORM_ENDPOINT) {
      console.info("ContactSubmission payload ready for Back4App Web Hosting endpoint", formData);
      errorMessage.textContent = "Online submission is not configured yet. Please call (615) 720-7568.";
      errorMessage.hidden = false;
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("ContactSubmission request failed", error);
      errorMessage.textContent = "We could not send your message right now. Please call (615) 720-7568 or try again soon.";
      errorMessage.hidden = false;
      submitButton.disabled = false;
      submitButton.textContent = "Submit Inquiry";
      return;
    }

    contactForm.reset();
    fields.forEach((field) => setFieldError(field, ""));
    submitButton.disabled = false;
    submitButton.textContent = "Submit Inquiry";

    if (successMessage) {
      successMessage.hidden = false;
    }
  });
}
