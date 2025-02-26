import { useRef, useImperativeHandle, forwardRef } from "react";
import coverImg from "../assets/cover.jpg";
import ScratchCard, { CUSTOM_BRUSH_PRESET } from "react-scratchcard-v2";

export interface ScratchCardProps {
  reward: string;
  className?: string;
}

export interface ScratchCardRef {
  reset: () => void;
}

const Card = forwardRef<ScratchCardRef, ScratchCardProps>((props, ref) => {
  const _ref = useRef<ScratchCard>(null);
  const onReset = () => {
    if (_ref.current) {
      _ref.current.reset();
    }
  };

  useImperativeHandle(ref, () => ({
    reset: onReset,
  }));

  return (
    <div className={props.className}>
      <ScratchCard
        ref={_ref}
        width={160}
        height={80}
        image={coverImg}
        finishPercent={80}
        customBrush={CUSTOM_BRUSH_PRESET}
        onComplete={() => console.log("complete")}
      >
        <div className="flex w-full h-full items-center justify-center ">
          <h2>{props.reward}</h2>
        </div>
      </ScratchCard>
    </div>
  );
});

export default Card;
