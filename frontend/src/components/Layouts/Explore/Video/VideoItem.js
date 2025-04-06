import classNames from "classnames/bind";
import style from "./Video.module.scss";
import { IconAudio, IconLike, IconMute } from "~/components/icons";
import { useRef } from "react";

const cx = classNames.bind(style);

function VideoItem({ video, muted, setIsMuted }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Playback prevented:", error));
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video về đầu khi hover ra
    }
  };

  return (
    <div
      className={cx("wrapper-item")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video src={video.url} ref={videoRef} muted={muted}></video>
      <div className={cx("card-info")}>
        <button className={cx("likes")}>
          <IconLike />
          <span>{video.likes}</span>
        </button>
        <button
          className={cx("audio")}
          onClick={() => setIsMuted((prev) => !prev)}
        >
          <span>{muted ? <IconMute /> : <IconAudio />}</span>
        </button>
      </div>
    </div>
  );
}

export default VideoItem;
