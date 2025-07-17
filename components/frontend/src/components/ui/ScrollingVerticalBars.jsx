import React, { useEffect, useRef } from "react";

const ScrollingVerticalBars = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const BAR_COUNT = 50;
    const bars = [];

    // Create bars
    for (let i = 0; i < BAR_COUNT; i++) {
      bars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        width: 2 + Math.random() * 4,
        height: 50 + Math.random() * 150,
        speed: 0.5 + Math.random() * 1,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }

    function animate() {
      ctx.fillStyle = "rgba(240, 238, 230, 0.1)";
      ctx.fillRect(0, 0, width, height);

      bars.forEach((bar) => {
        bar.y += bar.speed;

        if (bar.y > height) {
          bar.y = -bar.height;
          bar.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(18, 23, 20, ${bar.opacity})`;
        ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F0EEE6",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default ScrollingVerticalBars;
