// Contact Form JS

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    const inputs = form.querySelectorAll('.form__input[required]');
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        valid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });
    if (valid) {
      form.reset();
      alert('Thank you for contacting us!');
    }
  });

  form.querySelectorAll('.form__input').forEach(input => {
    input.addEventListener('input', function () {
      if (input.value.trim()) {
        input.classList.remove('is-invalid');
      }
    });
  });
});



document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector('.upload-wrapper');
  if (!wrapper) return;

  const fileInput = wrapper.querySelector('input[type="file"]');
  if (!fileInput) return;

  // Make wrapper clickable
  wrapper.addEventListener('click', function () {
    fileInput.click();
  });

  // Optional: Show selected file name in .upload-placeholder
  fileInput.addEventListener('change', function () {
    const fileName = this.files[0]?.name || 'Choose file';
    const placeholder = wrapper.querySelector('.upload-placeholder');
    if (placeholder) {
      placeholder.textContent = fileName;
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".signage-request-form form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isFormValid = true;

    const requiredFields = [
      { id: "name" },
      { id: "organization" },
      { id: "email", type: "email" },
      { id: "phone" },
      { id: "signType", isSelect: true },
      { id: "logoUpload", isFile: true, isWrapper: true }
    ];

    requiredFields.forEach(field => {
      const input = field.isWrapper
        ? document.querySelector(`#${field.id} input[type="file"]`)
        : document.getElementById(field.id);

      const container = field.isWrapper ? input.closest(".upload-wrapper") : input;
      const errorText = container.closest(".col-md-6, .col-12").querySelector(".error-text");

      let isValid = true;

      if (field.isSelect) {
        isValid = input.value !== "" && !input.options[input.selectedIndex].disabled;
      } else if (field.isFile) {
        isValid = input.files.length > 0;
      } else if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(input.value.trim());
      } else {
        isValid = input.value.trim() !== "";
      }

      if (isValid) {
        container.classList.add("isvalid");
        container.classList.remove("isinvalid");
        errorText?.classList.add("d-none");
      } else {
        container.classList.remove("isvalid");
        container.classList.add("isinvalid");
        errorText?.classList.remove("d-none");
        isFormValid = false;
      }
    });


  });
});