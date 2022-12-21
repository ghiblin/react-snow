import { useMemo } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { HTMLProps } from "react";

type SnowFlake = {
  x: number;
  y: number;
  opacity: number;
  speedX: number;
  speedY: number;
  radius: number;
};

function random(min: number, max: number): number {
  return min + Math.random() * (max - min + 1);
}

type SnowProps = {
  flakeCount?: number;
  width?: number;
  height?: number;
} & Omit<HTMLProps<HTMLCanvasElement>, "width" | "height">;

function drawSnowFlakes(ctx: CanvasRenderingContext2D, flakes: SnowFlake[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  flakes.forEach((flake) => {
    const gradient = ctx.createRadialGradient(
      flake.x,
      flake.y,
      0,
      flake.x,
      flake.y,
      flake.radius
    );

    gradient.addColorStop(0.0, `rgba(255, 255, 255, ${flake.opacity})`); // white
    gradient.addColorStop(0.8, `rgba(210, 236, 242, ${flake.opacity})`); // bluish
    gradient.addColorStop(1.0, `rgba(237, 247, 249, ${flake.opacity})`); // lighter bluish

    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = gradient;
    ctx.fill();
  });
}

function moveSnowFlakes(ctx: CanvasRenderingContext2D, flakes: SnowFlake[]) {
  flakes.forEach((flake) => {
    flake.x += flake.speedX;
    flake.y += flake.speedY;

    // if the snowflake exit from the screen, we move back it in from the top (-50px)
    if (flake.y > ctx.canvas.height) {
      flake.x = Math.random() * ctx.canvas.width * 1.5;
      flake.y = -50;
    }
  });
}

export default function Snow({ flakeCount = 250, ...props }: SnowProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  const flakes: SnowFlake[] = useMemo(() => {
    const { width = window.innerWidth, height = window.innerHeight } = props;
    return new Array(flakeCount).fill("").map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      opacity: Math.random(),
      speedX: random(-11, 11),
      speedY: random(7, 15),
      radius: random(0.5, 4.2),
    }));
  }, [flakeCount]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    function draw() {
      const context = ref.current?.getContext("2d");
      if (!context) return;

      drawSnowFlakes(context, flakes);
      moveSnowFlakes(context, flakes);
    }
    intervalId = setInterval(draw, 50);

    return function () {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return <canvas ref={ref} {...props} />;
}
