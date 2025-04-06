import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

import style from "./Home.module.scss";
import VideoList from "./Video/VideoList";
import { dataVideo } from "~/components/datafake/dataVideo";

import Comments from "../components/Comments";
import Button from "../components/Button";

const cx = classNames.bind(style);

function Home() {
  const [showComments, setShowComments] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(dataVideo[0]);
  return (
    <div
      className={cx("wrapper")}
      style={{ "--sidebar-width": showComments ? "24rem" : "0rem" }}
    >
      <VideoList
        videos={dataVideo}
        onVideoChange={setCurrentVideo}
        showComments={setShowComments}
      />
      <div className={cx("sidebar")}>
        <div className={cx("actions")}>
          <Button className={cx("btn")}>
            <FontAwesomeIcon icon={faChevronUp} />
          </Button>
          <Button className={cx("btn")}>
            <FontAwesomeIcon icon={faChevronDown} />
          </Button>
        </div>
      </div>
      {showComments && (
        <Comments
          comments={currentVideo.comments}
          setShowComments={setShowComments}
        />
      )}
    </div>
  );
}

export default Home;
