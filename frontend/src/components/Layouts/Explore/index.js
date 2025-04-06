import classNames from "classnames/bind";
import style from "./Explore.module.scss";

import Video, { VideoItem } from "./Video";
import { dataVideo } from "~/components/datafake/dataVideo";
import Button from "../components/Button";
import { useState } from "react";
const cx = classNames.bind(style);

function Explore() {
  const [isMuted, setIsMuted] = useState(false);
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Trending today</h2>
        <Video
          videos={dataVideo}
          className={cx("videos-trend")}
          setIsMuted={setIsMuted}
          isMuted={isMuted}
        />
        <span className={cx("category-title")}>
          Trend Vũ điệu Hey Hey Nhảy Edits
        </span>
      </div>
      <div className={cx("category")}>
        <h2 className={cx("title")}>You may like</h2>
        <div className={cx("category-list")}>
          <Button className={cx("category-item")}>All</Button>
          <Button className={cx("category-item")}>Singing & Dancing</Button>
          <Button className={cx("category-item")}>Comedy</Button>
          <Button className={cx("category-item")}>Sports</Button>
          <Button className={cx("category-item")}>Anime & Comics</Button>
          <Button className={cx("category-item")}>Relationship</Button>
          <Button className={cx("category-item")}>Shows</Button>
          <Button className={cx("category-item")}>Lipsync</Button>
          <Button className={cx("category-item")}>Daily Life</Button>
          <Button className={cx("category-item")}>Beauty Care</Button>
          <Button className={cx("category-item")}>Games</Button>
          <Button className={cx("category-item")}>Society</Button>
          <Button className={cx("category-item")}>Outfit</Button>
          <Button className={cx("category-item")}>Cars</Button>
          <Button className={cx("category-item")}>Food</Button>
          <Button className={cx("category-item")}>Animals</Button>
          <Button className={cx("category-item")}>Family</Button>
          <Button className={cx("category-item")}>Drama</Button>
          <Button className={cx("category-item")}>Fitness & Health</Button>
          <Button className={cx("category-item")}>Education</Button>
          <Button className={cx("category-item")}>Technology</Button>
        </div>
      </div>
      <div className={cx("explore-list")}>
        {dataVideo.map((video, index) => (
          <div className={cx("explore-item")} key={index}>
            <VideoItem video={video} muted={isMuted} setIsMuted={setIsMuted} />
            <div className={cx("info")}>
              <img src="/favicon.ico" alt="avatar" className={cx("avatar")} />
              <span>Khanh dep trai</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
