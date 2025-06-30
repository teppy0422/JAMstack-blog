"use client";
import { useEffect, useRef } from "react";

// ===================== 型定義 =====================
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  life: number;
  trail: { x: number; y: number }[];
};

type Firework = {
  x: number;
  y: number;
  startY: number;
  targetY: number;
  state: "launching" | "exploding";
  type: FireworkType;
  particles: Particle[];
  trail: { x: number; y: number }[];
  frame: number;
  maxFrame: number;
};

type FireworkType = "shidare" | "kiku" | "senrin" | "botan" | "yanagi" | "dora";

type FireworkConfig = {
  color: string | string[];
  count: number;
  speed: [number, number];
  size: [number, number];
  gravity: number;
  horizontalScale: number;
  verticalScale: number;
  angleRange: [number, number];
  lifeRange: [number, number];
  trailLength?: number;
  trailFade?: number;
  explodeHeightRange: [number, number];
  duration: [number, number];
};

// ===================== 花火タイプ設定 =====================
const FIREWORK_TYPES: Record<FireworkType, FireworkConfig> = {
  shidare: {
    color: "#ffaa33",
    count: 800,
    speed: [0, 2],
    size: [1, 2],
    gravity: 0.1,
    horizontalScale: 3,
    verticalScale: 3,
    angleRange: [0, Math.PI * 2],
    lifeRange: [1500, 2500],
    trailLength: 8,
    trailFade: 0.5,
    explodeHeightRange: [0.85, 0.95],
    duration: [280, 300],
  },
  kiku: {
    color: "#ffd1dc",
    count: 80,
    speed: [0, 2],
    size: [1, 2],
    gravity: 0.1,
    horizontalScale: 1,
    verticalScale: 1,
    angleRange: [0, Math.PI * 2],
    lifeRange: [40, 50],
    trailLength: 10,
    trailFade: 0.7,
    explodeHeightRange: [0.4, 0.55],
    duration: [50, 70],
  },
  senrin: {
    color: ["#ff7777", "#77ff77", "#7777ff", "#ffff77", "#ff77ff", "#77ffff"],
    count: 12,
    speed: [0.5, 1.5],
    size: [1, 2],
    gravity: 0.05,
    horizontalScale: 1,
    verticalScale: 1,
    angleRange: [0, Math.PI * 2],
    lifeRange: [1000, 1800],
    trailLength: 15,
    trailFade: 0.8,
    explodeHeightRange: [0.75, 0.85],
    duration: [60, 80],
  },
  botan: {
    color: "#ffcc00",
    count: 120,
    speed: [0.5, 1.5],
    size: [1.5, 2.5],
    gravity: 0.06,
    horizontalScale: 1,
    verticalScale: 1,
    angleRange: [0, Math.PI * 2],
    lifeRange: [80, 120],
    trailLength: 12,
    trailFade: 0.6,
    explodeHeightRange: [0.2, 0.45],
    duration: [70, 90],
  },
  yanagi: {
    color: "#77ff88",
    count: 200,
    speed: [0.3, 1],
    size: [1, 2],
    gravity: 0.1,
    horizontalScale: 1,
    verticalScale: 2,
    angleRange: [Math.PI * 0.6, Math.PI * 1.4],
    lifeRange: [80, 100],
    trailLength: 16,
    trailFade: 0.5,
    explodeHeightRange: [0.4, 0.6],
    duration: [90, 110],
  },
  dora: {
    color: "#ff66ff",
    count: 160,
    speed: [0.4, 1.2],
    size: [1.2, 2],
    gravity: 0.05,
    horizontalScale: 1.5,
    verticalScale: 1.5,
    angleRange: [0, Math.PI * 2],
    lifeRange: [70, 100],
    trailLength: 8,
    trailFade: 0.4,
    explodeHeightRange: [0.1, 0.3],
    duration: [80, 100],
  },
};

// ===================== 花火タイプの出現確率 =====================
const FIREWORK_WEIGHTS: [FireworkType, number][] = [
  ["shidare", 1],
  ["kiku", 8],
  ["senrin", 1],
  ["botan", 6],
  ["yanagi", 2],
  ["dora", 6],
];

function chooseFireworkType(): FireworkType {
  const totalWeight = FIREWORK_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);
  let rand = Math.random() * totalWeight;
  for (const [type, weight] of FIREWORK_WEIGHTS) {
    if (rand < weight) return type;
    rand -= weight;
  }
  return "kiku"; // フォールバック
}

// ===================== メインコンポーネント =====================
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

    const createFirework = (): Firework => {
      const type = chooseFireworkType();
      const config = FIREWORK_TYPES[type];
      const x = Math.random() * width * 0.8 + width * 0.1;
      const explodeRatio =
        Math.random() *
          (config.explodeHeightRange[1] - config.explodeHeightRange[0]) +
        config.explodeHeightRange[0];
      const targetY = height * (1 - explodeRatio);
      const maxFrame =
        Math.floor(Math.random() * (config.duration[1] - config.duration[0])) +
        config.duration[0];
      return {
        x,
        y: height,
        startY: height,
        targetY,
        state: "launching",
        type,
        particles: [],
        trail: [],
        frame: 0,
        maxFrame,
      };
    };

    let frameCount = 0;
    let cancelled = false;

    const animate = () => {
      if (cancelled) return;
      frameCount++;

      if (frameCount % 60 === 0) {
        fireworksRef.current.push(createFirework());
      }

      ctx.clearRect(0, 0, width, height);

      for (const fw of fireworksRef.current) {
        const config = FIREWORK_TYPES[fw.type];

        if (fw.state === "launching") {
          const t = fw.frame / fw.maxFrame;
          const eased = 1 - Math.pow(1 - t, 3);
          fw.y = fw.startY + (fw.targetY - fw.startY) * eased;
          fw.trail.push({ x: fw.x, y: fw.y });
          if (fw.trail.length > 10) fw.trail.shift();

          for (let i = 0; i < fw.trail.length - 1; i++) {
            const start = fw.trail[i];
            const end = fw.trail[i + 1];
            const fade = (i + 1) / fw.trail.length;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = `rgba(255,200,100,${fade})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,220,120,0.8)";
          ctx.shadowColor = "#fff";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          fw.frame++;
          if (fw.frame >= fw.maxFrame) {
            fw.state = "exploding";
            fw.y = fw.targetY;

            const isMultiColor = Array.isArray(config.color);
            if (fw.type === "senrin" || isMultiColor) {
              const colors = config.color as string[];
              const baseRadius = 30;
              const step = (Math.PI * 2) / colors.length;
              fw.particles = [];
              for (let i = 0; i < colors.length; i++) {
                const angle = i * step;
                const cx = fw.x + Math.cos(angle) * baseRadius;
                const cy = fw.y + Math.sin(angle) * baseRadius;
                for (let j = 0; j < config.count; j++) {
                  const subAngle = Math.random() * Math.PI * 2;
                  const subSpeed = Math.random() * 1.5 + 0.5;
                  fw.particles.push({
                    x: cx,
                    y: cy,
                    vx: Math.cos(subAngle) * subSpeed,
                    vy: Math.sin(subAngle) * subSpeed,
                    alpha: 1,
                    color: colors[i],
                    size: 1 + Math.random(),
                    life: 60 + Math.random() * 40,
                    trail: [],
                  });
                }
              }
            } else {
              fw.particles = Array.from({ length: config.count }, (_, i) => {
                const angle =
                  Math.random() *
                    (config.angleRange[1] - config.angleRange[0]) +
                  config.angleRange[0];
                const speed =
                  Math.random() * (config.speed[1] - config.speed[0]) +
                  config.speed[0];
                const vx = Math.cos(angle) * speed * config.horizontalScale;
                const vy = Math.sin(angle) * speed * config.verticalScale;
                const colorArr = Array.isArray(config.color)
                  ? config.color
                  : [config.color];
                const particleColor = colorArr[i % colorArr.length];
                return {
                  x: fw.x,
                  y: fw.y,
                  vx,
                  vy,
                  alpha: 1,
                  color: particleColor,
                  size:
                    Math.random() * (config.size[1] - config.size[0]) +
                    config.size[0],
                  life:
                    Math.random() *
                      (config.lifeRange[1] - config.lifeRange[0]) +
                    config.lifeRange[0],
                  trail: [],
                };
              });
            }
          }
        }

        if (fw.state === "exploding") {
          for (const p of fw.particles) {
            p.trail.push({ x: p.x, y: p.y });
            if (
              config.trailLength !== undefined &&
              p.trail.length > config.trailLength
            ) {
              p.trail.shift();
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vy += config.gravity;
            p.alpha -= 0.008;
            p.life--;

            if (config.trailFade !== undefined && p.trail.length > 1) {
              for (let i = 0; i < p.trail.length - 1; i++) {
                const start = p.trail[i];
                const end = p.trail[i + 1];
                const fade = (i + 1) / p.trail.length;
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.strokeStyle = `rgba(${hexToRGB(p.color)},${
                  p.alpha * fade * config.trailFade
                })`;
                ctx.lineWidth = p.size;
                ctx.stroke();
              }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRGB(p.color)},${p.alpha})`;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10 * p.alpha;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      fireworksRef.current = fireworksRef.current.filter(
        (fw) =>
          fw.state === "launching" ||
          fw.particles.some((p) => p.life > 0 && p.alpha > 0.01)
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
