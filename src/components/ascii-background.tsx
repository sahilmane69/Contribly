"use client";

import * as React from "react";

type Cell = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
};

type Pulse = {
  x: number;
  y: number;
  age: number;
  strength: number;
};

const ASCII_CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
const CHAR_WIDTH = 10;
const CHAR_HEIGHT = 14;
const MAX_CELLS = 4200;

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hash(ix: number, iy: number) {
  const value = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function valueNoise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  const ux = fade(fx);
  const uy = fade(fy);

  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
}

function fractalNoise(x: number, y: number, time: number) {
  let amplitude = 0.55;
  let frequency = 1;
  let value = 0;
  let total = 0;

  for (let octave = 0; octave < 4; octave += 1) {
    value +=
      valueNoise(
        x * frequency + time * (0.16 + octave * 0.035),
        y * frequency - time * (0.11 + octave * 0.025),
      ) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }

  return value / total;
}

function brightnessToChar(brightness: number) {
  if (brightness < 20) return ASCII_CHARS[0];
  if (brightness < 40) return ASCII_CHARS[1];
  if (brightness < 60) return ASCII_CHARS[2];
  if (brightness < 80) return ASCII_CHARS[3];
  if (brightness < 100) return ASCII_CHARS[4];
  if (brightness < 120) return ASCII_CHARS[5];
  if (brightness < 150) return ASCII_CHARS[6];
  if (brightness < 180) return ASCII_CHARS[7];
  if (brightness < 220) return ASCII_CHARS[8];
  return ASCII_CHARS[9];
}

export function AsciiBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const cellsRef = React.useRef<Cell[]>([]);
  const pulsesRef = React.useRef<Pulse[]>([]);
  const mouseRef = React.useRef({
    x: -9999,
    y: -9999,
    tx: -9999,
    ty: -9999,
    active: false,
  });
  const scrollSpeedRef = React.useRef(1);
  const animationRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef(0);
  const timeRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const buildGrid = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const targetCells = Math.floor((width / CHAR_WIDTH) * (height / CHAR_HEIGHT));
      const densityScale = Math.max(1, Math.sqrt(targetCells / MAX_CELLS));
      const gapX = Math.round(CHAR_WIDTH * densityScale);
      const gapY = Math.round(CHAR_HEIGHT * densityScale);
      const cells: Cell[] = [];

      for (let y = gapY / 2; y < height + gapY; y += gapY) {
        for (let x = gapX / 2; x < width + gapX; x += gapX) {
          cells.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }

      cellsRef.current = cells;
      context.font = `${Math.max(11, Math.min(15, gapY * 0.86))}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current.tx = event.clientX;
      mouseRef.current.ty = event.clientY;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.tx = -9999;
      mouseRef.current.ty = -9999;
    };

    const handleClick = (event: MouseEvent) => {
      pulsesRef.current.push({
        x: event.clientX,
        y: event.clientY,
        age: 0,
        strength: 1,
      });
      pulsesRef.current = pulsesRef.current.slice(-4);
    };

    const handleScroll = () => {
      const scrollProgress =
        window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollSpeedRef.current = 1 + scrollProgress * 1.35;
    };

    const draw = (timestamp: number) => {
      if (document.hidden) {
        animationRef.current = window.requestAnimationFrame(draw);
        return;
      }

      const delta = Math.min(32, timestamp - (lastTimeRef.current || timestamp));
      lastTimeRef.current = timestamp;
      timeRef.current += (delta / 1000) * scrollSpeedRef.current;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const mouse = mouseRef.current;
      mouse.x = lerp(mouse.x, mouse.tx, 0.16);
      mouse.y = lerp(mouse.y, mouse.ty, 0.16);

      context.fillStyle = "#050505";
      context.fillRect(0, 0, width, height);

      const activePulses = pulsesRef.current;
      const nextPulses: Pulse[] = [];
      for (const pulse of activePulses) {
        pulse.age += delta / 1000;
        if (pulse.age < 1.35) nextPulses.push(pulse);
      }
      pulsesRef.current = nextPulses;

      for (const cell of cellsRef.current) {
        const dx = cell.x - mouse.x;
        const dy = cell.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        const influence = mouse.active ? Math.max(0, 1 - distance / 170) : 0;
        const angle = Math.atan2(dy, dx);
        const ripple = Math.sin(distance * 0.06 - timeRef.current * 8) * influence;
        const force = influence * influence * 1.85 + ripple * 0.45;

        cell.vx += Math.cos(angle) * force;
        cell.vy += Math.sin(angle) * force;

        let pulseIntensity = 0;
        for (const pulse of nextPulses) {
          const pulseDistance = Math.hypot(cell.ox - pulse.x, cell.oy - pulse.y);
          const radius = pulse.age * 520;
          const wave = Math.max(0, 1 - Math.abs(pulseDistance - radius) / 55);
          const fadeOut = Math.max(0, 1 - pulse.age / 1.35);
          pulseIntensity += wave * fadeOut * pulse.strength;
          if (wave > 0) {
            const pulseAngle = Math.atan2(cell.oy - pulse.y, cell.ox - pulse.x);
            cell.vx += Math.cos(pulseAngle) * wave * fadeOut * 2.4;
            cell.vy += Math.sin(pulseAngle) * wave * fadeOut * 2.4;
          }
        }

        cell.vx += (cell.ox - cell.x) * 0.045;
        cell.vy += (cell.oy - cell.y) * 0.045;
        cell.vx *= 0.82;
        cell.vy *= 0.82;
        cell.x += cell.vx;
        cell.y += cell.vy;

        const noiseWarp = influence * 0.9 + pulseIntensity * 0.55;
        const n = fractalNoise(
          cell.ox * 0.004 + Math.sin(timeRef.current * 0.25) * 0.35 + noiseWarp,
          cell.oy * 0.006 + Math.cos(timeRef.current * 0.2) * 0.35 - noiseWarp,
          timeRef.current,
        );
        const brightness = Math.max(
          0,
          Math.min(255, n * 205 + influence * 95 + pulseIntensity * 115 - 24),
        );
        const char = brightnessToChar(brightness);

        if (char === " ") continue;

        const alpha = Math.min(0.15 + influence * 0.18 + pulseIntensity * 0.16, 0.42);
        if (brightness > 180 || influence > 0.55 || pulseIntensity > 0.55) {
          context.shadowColor = `rgba(255,255,255,${Math.min(alpha, 0.32)})`;
          context.shadowBlur = 9;
        } else {
          context.shadowBlur = 0;
        }

        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.fillText(char, cell.x, cell.y);
      }

      context.shadowBlur = 0;
      animationRef.current = window.requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      lastTimeRef.current = performance.now();
    };

    buildGrid();
    handleScroll();
    window.addEventListener("resize", buildGrid);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationRef.current = window.requestAnimationFrame(draw);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", buildGrid);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 size-full bg-[#050505]"
    />
  );
}
