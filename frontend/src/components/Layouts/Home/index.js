import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useState, useEffect, useRef } from "react"; // Added useEffect, useRef
import axios from "axios";

import style from "./Home.module.scss";
import VideoList from "./Video/VideoList";
// import { dataVideo } from "~/components/datafake/dataVideo"; // Keep if needed for fallback/initial structure, otherwise remove

import Comments from "../components/Comments";
import Button from "../components/Button";

const cx = classNames.bind(style);
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Provide a fallback for local dev if needed
const INITIAL_LOAD_LIMIT = 10;
const SUBSEQUENT_LOAD_LIMIT = 5;
const SCROLL_THRESHOLD = 300; // Pixels from the bottom to trigger load

function Home() {
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

      console.log(`Fetching page ${pageNumToFetch} with limit ${limitToFetch}`);
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_URL}/api/videos`, {
          params: {
            page: pageNumToFetch,
            limit: limitToFetch
          }
        });

        const { data, pagination, success } = response.data;
        console.log("API Response:", response.data);

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
    <div
      className={cx("wrapper")}
      style={{ "--sidebar-width": showComments ? "24rem" : "0rem" }}
    >
      <VideoList
        videos={videos}
        currentVideoId={currentVideo?._id}
        onVideoChange={handleVideoChange}
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

      {showComments && currentVideo && (
        <Comments
          comments={currentVideo.comments}
          videoId={currentVideo._id}
          setShowComments={setShowComments}
        />
      )}
    </div>
  );
}

export default Home;
