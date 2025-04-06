import React, { useState } from 'react';

function VideoSidebar({ likes, messages, shares }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    // Gửi request lên backend để cập nhật số lượng like
  };

  return (
    <div className="videoSidebar">
      <div className="videoSidebar__button">
        {/* <FaHeart onClick={handleLike} color={liked ? "red" : "white"} fontSize="large" /> */}
        <p>{liked ? likes + 1 : likes}</p>
      </div>
      <div className="videoSidebar__button">
        {/* <FaComment fontSize="large" /> */}
        <p>{messages}</p>
      </div>
      <div className="videoSidebar__button">
        {/* <FaShare fontSize="large" /> */}
        <p>{shares}</p>
      </div>
    </div>
  );
}

export default VideoSidebar;