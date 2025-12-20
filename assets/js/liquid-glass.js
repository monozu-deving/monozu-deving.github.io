function bindLiquidGlass() {
  const blobs = document.querySelectorAll(".glass-btn");

  blobs.forEach((blob) => {
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let rafId = null;

    const updatePosition = () => {
      // Magnetic interpolation
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      blob.style.setProperty("--rx", `${currentX}%`);
      blob.style.setProperty("--ry", `${currentY}%`);

      // Surface Tension: Slight skew/distortion based on distance from center
      const dx = (currentX - 50) / 10;
      const dy = (currentY - 50) / 10;
      blob.style.transform = `scale(1.1) translate(${dx * 2}px, ${dy * 2}px) skew(${dx}deg, ${dy}deg)`;

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        rafId = null;
      }
    };

    blob.addEventListener("mousemove", (e) => {
      const rect = blob.getBoundingClientRect();
      // Calculate relative position with "pull"
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      targetX = x;
      targetY = y;

      if (!rafId) rafId = requestAnimationFrame(updatePosition);
    });

    blob.addEventListener("mouseleave", () => {
      targetX = 50;
      targetY = 50;
      blob.style.transform = "";
      if (!rafId) rafId = requestAnimationFrame(updatePosition);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindLiquidGlass);
} else {
  bindLiquidGlass();
}
