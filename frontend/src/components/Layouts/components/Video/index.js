import classNames from "classnames/bind";
import style from "./Video.module.scss";
import React, { useRef, useState } from "react";

const cx = classNames.bind(style);
function Video({ url, channel, description, song, likes, comments, shares }) {
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const handleVideoPress = () => {};
  return (
    <div className={cx("video")}>
      <video
        className={cx("video-player")}
        src={url}
        onClick={handleVideoPress}
        ref={videoRef}
        loop
        muted
      ></video>


      <div className="video__info">
        <p>@{channel}</p>
        <p>{description}</p>
        
      </div>
    </div>
  );
}

export default Video;
