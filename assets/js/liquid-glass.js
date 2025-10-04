document.addEventListener("mousemove", (e) => {
    document.querySelectorAll(".glass-btn").forEach((btn) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty("--x", `${x}px`);
      btn.style.setProperty("--y", `${y}px`);
    });
  });
  