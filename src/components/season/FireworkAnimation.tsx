"use client";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  life: number;
};

type Firework = {
  x: number;
  y: number;
  type: FireworkType;
  particles: Particle[];
};

type FireworkType = "shidare" | "kiku";

const FIREWORK_TYPES: Record<
  FireworkType,
  {
    color: string;
    count: number;
    speed: [number, number]; // [min, max]
    size: [number, number];
    gravity: number;
    horizontalScale: number;
    verticalScale: number;
    angleRange: [number, number]; // 発射角度の範囲（ラジアン）
    lifeRange: [number, number]; // 粒子の寿命範囲（フレーム数）
  }
> = {
  shidare: {
    color: "#ffaa33", // オレンジ
    count: 400,
    speed: [0.5, 1.5],
    size: [1, 4],
    gravity: 0.1,
    horizontalScale: 3,
    verticalScale: 3,
    angleRange: [0, Math.PI * 2],
    lifeRange: [15000, 25000], // 長めにゆっくり消える
  },
  kiku: {
    color: "#ffd1dc", // 白っぽいピンク
    count: 40,
    speed: [1, 3],
    size: [1, 2.5],
    gravity: 0.01,
    horizontalScale: 1,
    verticalScale: 1,
    angleRange: [0, Math.PI * 2], // 全方向
    lifeRange: [80, 120],
  },
};

export default function FireworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const createFirework = (width: number, height: number): Firework => {
      const type: FireworkType = Math.random() > 0.5 ? "shidare" : "kiku";
      const config = FIREWORK_TYPES[type];
      const color = config.color;

      const x = Math.random() * width * 0.8 + width * 0.1;
      const y = Math.random() * height * 0.4 + height * 0.1;

      const particles = Array.from({ length: config.count }, () => {
        const angle =
          Math.random() * (config.angleRange[1] - config.angleRange[0]) +
          config.angleRange[0];
        const speed =
          Math.random() * (config.speed[1] - config.speed[0]) + config.speed[0];

        const vx = Math.cos(angle) * speed * config.horizontalScale;
        const vy = Math.sin(angle) * speed * config.verticalScale;

        return {
          x,
          y,
          vx,
          vy,
          alpha: 1,
          color,
          size:
            Math.random() * (config.size[1] - config.size[0]) + config.size[0],
          life: Math.floor(
            Math.random() * (config.lifeRange[1] - config.lifeRange[0]) +
              config.lifeRange[0]
          ),
        };
      });

      return { x, y, type, particles };
    };

    let frameCount = 0;
    let cancelled = false;

    const animate = () => {
      if (cancelled) return;

      frameCount++;
      if (frameCount % 60 === 0) {
        fireworksRef.current.push(createFirework(width, height));
      }

      ctx.clearRect(0, 0, width, height);

      for (const fw of fireworksRef.current) {
        const config = FIREWORK_TYPES[fw.type];

        for (const p of fw.particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += config.gravity;

          p.alpha -= 0.01;
          p.life--;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hexToRGB(p.color)},${p.alpha})`;
          ctx.fill();
        }
      }

      fireworksRef.current = fireworksRef.current.filter((fw) =>
        fw.particles.some((p) => p.life > 0 && p.alpha > 0)
      );

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        background: "transparent",
      }}
    />
  );
}

function hexToRGB(hex: string): string {
  const bigint = parseInt(hex.slice(1), 16);
  return `${(bigint >> 16) & 255},${(bigint >> 8) & 255},${bigint & 255}`;
}
