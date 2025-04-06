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

const VideoItem = forwardRef(({ video, index, onPlay, showComments }, ref) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimes, setCurrentTimes] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [volumePrev, setVolumePrev] = useState(volume);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (videoRef.current && document.visibilityState === "visible") {
            videoRef.current.currentTime = 0;

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) =>
                console.log("Autoplay blocked:", error)
              );
            }
            setIsPlaying(true);
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleCurrentTimesChange = (newCurrentTimes) => {
    setIsSeeking(true);
    const clampedCurrentTimes = Math.max(0, Math.min(1, newCurrentTimes));
    setCurrentTimes(clampedCurrentTimes);
  };

  const handleSeekEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTimes * duration;
    }
    setIsSeeking(false);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.volume = volume;

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (!isSeeking && videoRef.current && duration > 0) {
        setCurrentTimes(videoRef.current.currentTime / duration);
      }
    };

    videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [volume, duration, isSeeking]);

  const handleVideoPress = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(duration, newVolume));
    setVolume(clampedVolume);
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      setVolumePrev(volume);
      setVolume(0);
    } else {
      setVolume(volumePrev);
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className={cx("video-item")}>
      <div className={cx("video-player")}>
        <div className={cx("video-wrapper")}>
          <video
            src={video.url}
            onClick={handleVideoPress}
            ref={videoRef}
            muted={isMuted}
            autoPlay
            onPlay={onPlay}
            loop
          ></video>
          <div className={cx("media-controls")}>
            <div className={cx("audio")}>
              <button onClick={handleToggleMute}>
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
          <div className={cx("video-info")}>
            <div className={cx("overlay")} />
            <div className={cx("video-content")}>
              <span>{video.chanel}</span>
              <span>{video.description}</span>
              <span>{video.tags}</span>
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
            <img src="/favicon.ico" alt="avatar" />
            <span className={cx("btn-add")}>
              <IconAdd />
            </span>
          </div>

          <VideoAction icon={<IconLikeActive />} label={video.likes} />
          <VideoAction
            onClick={() => showComments((prev) => !prev)}
            icon={<IconComment />}
            label={video.comments.reduce((total, comment) => {
              return (comment.reply ? comment.reply.length : 0) + 1 + total;
            }, 0)}
          />
          <VideoAction icon={<IconSave />} label={video.save} />
          <VideoAction icon={<IconShare />} label={video.share} />
        </div>
      </div>
    </div>
  );
});

export default VideoItem;
