function bindLiquidGlass() {
    document.querySelectorAll(".glass-btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty("--x", `${x}px`);
        btn.style.setProperty("--y", `${y}px`);
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--x", `50%`);
        btn.style.setProperty("--y", `40%`);
      });
    });
  }
  
  /* 테마 JS가 DOM을 재구성한 후에도 동작하게 보장 */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindLiquidGlass);
  } else {
    bindLiquidGlass();
  }
  
  /* Greedy-nav가 AJAX 로드 시 재호출 대비 */
  window.addEventListener("load", bindLiquidGlass);
  