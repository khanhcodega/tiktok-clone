import classNames from "classnames/bind";
import style from "./Video.module.scss";
import React, { useRef, useState, useEffect, forwardRef } from "react";

import {
  IconAdd,
  IconAudio,
  IconAutoScroll,
  IconCaptions,
  IconComment,
  IconLikeActive,
  IconMiniplayer,
  IconMore,
  IconMute,
  IconNotInterested,
  IconQuality,
  IconReport,
  IconSave,
  IconShare
} from "~/components/icons";
import ProgressBar from "../../components/ProgressBar";
import VideoAction from "./VideoAction";
import CustomTooltip from "../../components/CustomTooltip";
import Menu, { MenuItem } from "../../components/Menu";
import Switch from "../../components/Switch";
const cx = classNames.bind(style);
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const VideoItem = forwardRef(
  ({ video, index, onPlay, showComments, currentVideoId }, ref) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTimes, setCurrentTimes] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(1);
    const [volumePrev, setVolumePrev] = useState(volume);

    const { user, videoUrl, description, likes, comments, save, share, _id } =
      video || {};

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!videoRef.current) return;

          if (entry.isIntersecting) {
            if (document.visibilityState === "visible") {
              videoRef.current.currentTime = 0;

              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    // setIsPlaying(true);
                    if (onPlay) onPlay(_id);
                  })
                  .catch((error) => {
                    setIsPlaying(false);
                    console.log("Autoplay blocked:", error);
                  });
              }
            }
          } else {
            videoRef.current.pause();
            // setIsPlaying(false);
          }
        },
        { threshold: 0.5 }
      );
      const currentVideoElement = videoRef.current;
      if (currentVideoElement) {
        observer.observe(currentVideoElement);
      }

      return () => {
        if (currentVideoElement) {
          observer.unobserve(currentVideoElement);
        }
      };
    }, [onPlay, _id]);

    const handleCurrentTimesChange = (newCurrentTimes) => {
      setIsSeeking(true);
      const clampedCurrentTimes = Math.max(0, Math.min(1, newCurrentTimes));
      setCurrentTimes(clampedCurrentTimes);

      if (videoRef.current) {
        videoRef.current.currentTime = clampedCurrentTimes * duration;
      }
    };

    const handleSeekEnd = () => {
      setIsSeeking(false);
      if (isPlaying && videoRef.current) {
        videoRef.current.currentTime = currentTimes * duration;
      }
    };

    useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      videoElement.volume = isMuted ? 0 : volume;

      const handleLoadedMetadata = () => {
        if (videoElement) {
          setDuration(videoElement.duration);
        }
      };

      const handleTimeUpdate = () => {
        if (!isSeeking && videoElement && duration > 0) {
          setCurrentTimes(videoElement.currentTime / duration);
        }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleVolumeChange = () => {
        if (videoElement) {
          const currentMuted = videoElement.muted || videoElement.volume === 0;
          const currentVolume = videoElement.volume;
          // Chỉ cập nhật state nếu nó khác với state hiện tại để tránh vòng lặp render không cần thiết
          if (currentMuted !== isMuted) {
            setIsMuted(currentMuted);
          }
          if (currentVolume !== volume) {
            setVolume(currentVolume);
          }
        }
      };

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);
      videoElement.addEventListener("volumechange", handleVolumeChange);
      return () => {
        if (videoElement) {
          videoElement.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          videoElement.removeEventListener("timeupdate", handleTimeUpdate);
          videoElement.removeEventListener("play", handlePlay);
          videoElement.removeEventListener("pause", handlePause);
          videoElement.removeEventListener("volumechange", handleVolumeChange);
        }
      };
    }, [isMuted, isSeeking, volume]);

    const handleVideoPress = () => {
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Lỗi khi phát video lúc click:", error);
            // Xử lý lỗi nếu có (hiếm khi xảy ra khi người dùng tự click)
            setIsPlaying(false);
          });
        }
      }
    };

    const handleVolumeChange = (newVolume) => {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      setVolume(clampedVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        const shouldBeMuted = newVolume === 0;
        if (videoRef.current.muted !== shouldBeMuted) {
          videoRef.current.muted = shouldBeMuted;
        }
      }
    };

    const handleToggleMute = () => {
      if (!videoRef.current) return;

      if (!isMuted) {
        setVolumePrev(volume);
        setVolume(0);
      } else {
        setVolume(volumePrev);
      }
      setIsMuted(!isMuted);
    };
    const totalCommentsCount = Array.isArray(comments)
      ? comments.reduce((total, comment) => {
          return total + 1 + (comment.reply ? comment.reply.length : 0);
        }, 0)
      : 0;
    return (
      <div className={cx("video-item")}>
        <div className={cx("video-player")}>
          <div className={cx("video-wrapper")}>
            <video
              src={videoUrl}
              onClick={handleVideoPress}
              ref={videoRef}
              muted={isMuted}
              // autoPlay
              // onPlay={onPlay}
              playsInline
              loop
            ></video>
            <div className={cx("media-controls")}>
              <div className={cx("audio")}>
                <button className={cx("btn-mute")} onClick={handleToggleMute}>
                  <span>{isMuted ? <IconMute /> : <IconAudio />}</span>
                </button>
                <div className={cx("volume")}>
                  <ProgressBar
                    width={volume}
                    offset={handleVolumeChange}
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>
              <CustomTooltip
                setArrow={false}
                className={cx("tooltip")}
                content={
                  <Menu>
                    <MenuItem
                      icon={<IconQuality />}
                      title={
                        <div className={cx("item-title")}>
                          <span>Quality</span>
                          <span>1080P</span>
                        </div>
                      }
                    />

                    <MenuItem icon={<IconCaptions />} title={"Captions"} />
                    <MenuItem
                      icon={<IconAutoScroll />}
                      title={
                        <div className={cx("item-title")}>
                          <span>Auto scroll</span>
                          <Switch />
                        </div>
                      }
                    />
                    <MenuItem icon={<IconMiniplayer />} title={"Miniplayer"} />
                    <MenuItem
                      icon={<IconNotInterested />}
                      title={"Not interested"}
                    />
                    <MenuItem icon={<IconReport />} title={"Report"} />
                  </Menu>
                }
                placement="bottom"
              >
                <div className={cx("action")}>
                  <span>
                    <IconMore />
                  </span>
                </div>
              </CustomTooltip>
            </div>
            <div className={cx("overlay")} />
            <div className={cx("video-info")}>
              <div className={cx("video-content")}>
                <span>{user.username}</span>
                <span>{description}</span>
              </div>
            </div>
            <div className={cx("video-control")}>
              <ProgressBar
                video
                width={currentTimes}
                offset={handleCurrentTimesChange}
                onChange={handleCurrentTimesChange}
                onSeekEnd={handleSeekEnd}
              />
            </div>
          </div>
          <div className={cx("actions-bar")}>
            <div className={cx("flowing")}>
              <img src={`${API_URL}/avatar/${user.avatar}`} alt="avatar" />
              <span className={cx("btn-add")}>
                <IconAdd />
              </span>
            </div>

            <VideoAction icon={<IconLikeActive />} label={likes.length} />
            <VideoAction
              onClick={() => showComments((prev) => !prev)}
              videoCurrent={videoRef.current}
              icon={<IconComment />}
              label={totalCommentsCount}
            />
            <VideoAction icon={<IconSave />} label={video.save} />
            <VideoAction icon={<IconShare />} label={video.share} />
          </div>
        </div>
      </div>
    );
  }
);

export default VideoItem;
