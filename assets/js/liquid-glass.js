function bindLiquidGlass() {
  document.querySelectorAll(".glass-btn").forEach((btn) => {
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let rafId = null;

    const updatePosition = () => {
      // Smooth interpolation (fluid feeling)
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      btn.style.setProperty("--rx", `${currentX}%`);
      btn.style.setProperty("--ry", `${currentY}%`);

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        rafId = null;
      }
    };

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;

      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    });

    btn.addEventListener("mouseleave", () => {
      targetX = 50;
      targetY = 50;
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    });
  });
}

// Ensure binding on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindLiquidGlass);
} else {
  bindLiquidGlass();
}
