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
  const fileInput = wrapper.querySelector('input[type="file"]');

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