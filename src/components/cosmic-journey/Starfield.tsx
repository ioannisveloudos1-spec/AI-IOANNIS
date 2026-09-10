import React, { useEffect, useRef } from "react";

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate stars
    const starCount = Math.min(160, Math.floor((width * height) / 8000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      hue: Math.random() > 0.6 ? 45 : Math.random() > 0.3 ? 210 : 270, // gold, blue, or purple
    }));

    let step = 0;

    const render = () => {
      step++;
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, width, height);

      // Subtle nebula glow
      const grad1 = ctx.createRadialGradient(
        width * 0.3,
        height * 0.4,
        50,
        width * 0.3,
        height * 0.4,
        width * 0.6
      );
      grad1.addColorStop(0, "rgba(56, 189, 248, 0.04)"); // sky blue
      grad1.addColorStop(1, "rgba(10, 10, 15, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75,
        height * 0.7,
        50,
        width * 0.75,
        height * 0.7,
        width * 0.5
      );
      grad2.addColorStop(0, "rgba(168, 85, 247, 0.04)"); // purple
      grad2.addColorStop(1, "rgba(10, 10, 15, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (const star of stars) {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const currentOpacity =
          star.opacity + Math.sin(step * star.pulseSpeed) * 0.25;
        const clampedOpacity = Math.max(0.1, Math.min(1, currentOpacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 80%, 75%, ${clampedOpacity})`;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = `hsla(${star.hue}, 90%, 70%, ${clampedOpacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
