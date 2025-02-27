import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  MouseEvent,
  TouchEvent,
} from "react";
import "./ScratchCard.css";

const COVER_COLOR = "#A39D9D";

export interface ScratchCardProps {
  reward: string;
  className?: string;
  finishPercent: number;
  onComplete?: () => void;
}

export interface ScratchCardRef {
  reset: () => void;
}

const Card = forwardRef<ScratchCardRef, ScratchCardProps>((props, ref) => {
  const _ref = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const initCanvas = () => {
    const canvas = _ref.current;
    if (canvas) {
      const ctx = canvas?.getContext("2d");

      if (ctx) {
        ctx.fillStyle = COVER_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(initCanvas, [props.reward, props.finishPercent]);

  const handleMouseMove = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) => {
    if (isMouseDown && _ref.current) {
      const ctx = _ref.current.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "destination-out";

        let x, y;
        if ("clientX" in e) {
          // 鼠标事件
          const rect = _ref.current.getBoundingClientRect();
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        } else {
          // 触摸事件
          const rect = _ref.current.getBoundingClientRect();
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        }

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        const imageData = ctx.getImageData(
          0,
          0,
          _ref.current.width,
          _ref.current.height
        );
        let transparentPixels = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] === 0) {
            transparentPixels++;
          }
        }
        const percentage =
          (transparentPixels / (imageData.data.length / 4)) * 100;

        if (percentage > props.finishPercent) {
          ctx.clearRect(0, 0, _ref.current.width, _ref.current.height);
          if (typeof props.onComplete === "function") {
            props.onComplete();
          }
        }
      }
    }
  };

  useImperativeHandle(ref, () => ({
    reset: initCanvas,
  }));

  return (
    <div className={`relative w-40 h-20 ${props.className}`}>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center user-select-none">
        <h2>{props.reward}</h2>
      </div>
      <canvas
        ref={_ref}
        className="absolute top-0 left-0"
        width={160}
        height={80}
        onMouseDown={() => {
          setIsMouseDown(true);
        }}
        onMouseUp={() => {
          setIsMouseDown(false);
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsMouseDown(false)}
        onTouchStart={() => {
          setIsMouseDown(true);
        }}
        onTouchEnd={() => {
          setIsMouseDown(false);
        }}
        onTouchMove={handleMouseMove}
        // finishPercent={80}
        // onComplete={() => console.log("complete")}
      />
    </div>
  );
});

export default Card;
