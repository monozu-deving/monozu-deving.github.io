function bindLiquidGlass() {
    document.querySelectorAll(".glass-btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        // 상대 좌표를 0~100%로 환산
        const rx = ((e.clientX - rect.left) / rect.width) * 100;
        const ry = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty("--rx", `${rx}%`);
        btn.style.setProperty("--ry", `${ry}%`);
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--rx", "50%");
        btn.style.setProperty("--ry", "40%");
      });
    });
  }
  
  // DOM 로드 후 즉시 바인딩
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bindLiquidGlass);
  else bindLiquidGlass();
  