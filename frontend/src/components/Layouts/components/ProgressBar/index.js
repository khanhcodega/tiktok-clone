import classNames from "classnames/bind";
import style from "./ProgressBar.module.scss";
import { useEffect, useRef, useState } from "react";

const cx = classNames.bind(style);

function ProgressBar({ width, offset, onChange, video = false, onSeekEnd }) {
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef(null);

  const handleClick = (e) => {
    const progress = progressRef.current;
    const progressRect = progress.getBoundingClientRect();
    const newOffset = Math.max(
      0,
      Math.min(1, (e.clientX - progressRect.left) / progressRect.width)
    );
    onChange(newOffset);
    onSeekEnd?.();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onSeekEnd?.();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const progress = progressRef.current;
      const progressRect = progress.getBoundingClientRect();
      const newOffset = Math.max(
        0,
        Math.min(1, (e.clientX - progressRect.left) / progressRect.width)
      );
      onChange(newOffset);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onChange]);

  return (
    <div
      className={cx("container", { video })}
      ref={progressRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        "--progress-width": `${width * 100}%`
      }}
    >
      <div className={cx("progress")}></div>
      <div
        className={cx("thum")}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></div>
    </div>
  );
}

export default ProgressBar;
