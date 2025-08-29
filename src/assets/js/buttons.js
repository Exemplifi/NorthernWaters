document.querySelectorAll(".toggleButton").forEach((button) => {
  button.addEventListener("click", function () {
    const isPressed = this.getAttribute("aria-pressed") === "true";
    this.setAttribute("aria-pressed", String(!isPressed));
  });
});
