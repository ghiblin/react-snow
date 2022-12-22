import { useMemo } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { HTMLProps } from "react";
import { SnowFlake } from "./snow-flake";

function random(min: number, max: number): number {
  return min + Math.random() * (max - min + 1);
}

type SnowProps = {
  flakeCount?: number;
  width?: number;
  height?: number;
} & Omit<HTMLProps<HTMLCanvasElement>, "width" | "height">;

export default function Snow({ flakeCount = 250, ...props }: SnowProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  const flakes: SnowFlake[] = useMemo(() => {
    const { width = window.innerWidth, height = window.innerHeight } = props;
    return new Array(flakeCount)
      .fill(null)
      .map(
        () =>
          new SnowFlake(
            random(0, width),
            random(0, height),
            Math.random(),
            random(5, 40),
            random(0.5, 4.2),
            height
          )
      );
  }, [flakeCount]);

  useEffect(() => {
    const framesPerSecond = 60;
    const frameInterval = 1000 / framesPerSecond;
    let previousTime = window.performance.now();

    // let intervalId: NodeJS.Timer;
    let animationRequestId: number;

    function draw(currentTime: DOMHighResTimeStamp) {
      const context = ref.current?.getContext("2d");
      if (!context) return;

      const delta = (currentTime - previousTime) / frameInterval;
      previousTime = currentTime;

      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      flakes.forEach((flake) => {
        flake.draw(context);
        flake.update(delta);
      });

      animationRequestId = requestAnimationFrame(draw);
    }
    animationRequestId = requestAnimationFrame(draw);

    return function () {
      if (animationRequestId) {
        cancelAnimationFrame(animationRequestId);
      }
    };
  }, []);

  return <canvas ref={ref} {...props} />;
}
