// Aria-expanded toggle for toggler button
document.getElementById('toggleButton').addEventListener('click', function() {
    const isPressed = this.getAttribute('aria-pressed') === 'true';
    this.setAttribute('aria-pressed', String(!isPressed));
});
