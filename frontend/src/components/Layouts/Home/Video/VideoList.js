import classNames from "classnames/bind";
import style from "./Video.module.scss";
import VideoItem from "./VideoItem";
import React, { useRef, useState } from "react";

const cx = classNames.bind(style);

function VideoList({ videos, onVideoChange, showComments,currentVideoId }) {
  const videoRefs = useRef([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  console.log(currentVideoIndex);

  const handleVideoPlay = (index) => {
    setCurrentVideoIndex(index);
    onVideoChange(videos[index]); // Gửi video hiện tại lên component cha
  };

  return (
    <div className={cx("video-list")}>
      {videos.map((video, index) => (
        <VideoItem
          key={index}
          video={video}
          ref={(el) => (videoRefs.current[index] = el)}
          onPlay={() => handleVideoPlay(index)}
          showComments={showComments}
          currentVideoId={currentVideoId}
          
        />
      ))}
    </div>
  );
}

export default VideoList;
