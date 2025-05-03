import classNames from "classnames/bind";
import style from "./Explore.module.scss";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

import Video, { VideoItem } from "./Video";
import { dataVideo } from "~/components/datafake/dataVideo";
import Button from "../components/Button";
const cx = classNames.bind(style);
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const INITIAL_LOAD_LIMIT = 10;
const SUBSEQUENT_LOAD_LIMIT = 5;
const SCROLL_THRESHOLD = 300;
function Explore() {
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null); // Initialize as null
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1); // Page number for the *next* fetch
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const fetchVideos = useCallback(
    async (pageNumToFetch, limitToFetch) => {
      if (isLoading) return;

      // console.log(`Fetching page ${pageNumToFetch} with limit ${limitToFetch}`);
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_URL}/api/videos`, {
          params: {
            page: pageNumToFetch,
            limit: limitToFetch
          }
        });

        const { data, pagination, success } = response.data;
        // console.log("API Response:", response.data);

        if (success && data && data.length > 0) {
          setVideos((prevVideos) => {
            const newVideos = data.filter(
              (vid) => !prevVideos.some((prevVid) => prevVid._id === vid._id)
            );
            const updatedVideos = [...prevVideos, ...newVideos];

            if (
              prevVideos.length === 0 &&
              updatedVideos.length > 0 &&
              !currentVideo
            ) {
              setCurrentVideo(updatedVideos[0]);
            }
            return updatedVideos;
          });
          setPage(pageNumToFetch + 1);

          const morePagesExist =
            pagination?.next !== undefined && pagination.next !== null;
          const likelyEndOfData = data.length < limitToFetch;
          setHasMore(morePagesExist || !likelyEndOfData);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Fetch Videos Error:", err);
      } finally {
        setIsLoading(false);
      }
    },

    [API_URL, isLoading, currentVideo]
  );

  useEffect(() => {
    if (isInitialMount.current && videos.length === 0) {
      isInitialMount.current = false;
      fetchVideos(1, INITIAL_LOAD_LIMIT);
    }
  }, [fetchVideos, videos.length]);
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - SCROLL_THRESHOLD &&
        !isLoading &&
        hasMore
      ) {
        fetchVideos(page, SUBSEQUENT_LOAD_LIMIT);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore, page, fetchVideos]);

  const handleVideoChange = useCallback((video) => {
    setCurrentVideo(video);
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Trending today</h2>
        <Video
          videos={videos}
          currentVideoId={currentVideo?._id}
          onVideoChange={handleVideoChange}
          showComments={setShowComments}
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
        {videos.map((video, index) => (
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
