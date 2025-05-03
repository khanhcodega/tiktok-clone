import classNames from "classnames/bind";
import style from "./Video.module.scss";
import VideoItem from "./VideoItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css/effect-coverflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(style);

function VideoList({ videos, className,isMuted,setIsMuted }) {

  return (
    <div className={cx("wrapper")}>
      <div className={cx("swiper-button-prev")}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      <Swiper
        loop={true}
        effect={"coverflow"}
        grabCursor={true}
        centerInsufficientSlides={true}
        centeredSlides={false}
        loopfillgroupwithblank="false"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1.2,
          slideShadows: true
        }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: `.${cx("swiper-button-next")}`,
          prevEl: `.${cx("swiper-button-prev")}`
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 }
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className={cx("wrapper", { [className]: className })}
      >
        {videos.map((video, index) => (
          <SwiperSlide>
            <VideoItem
              key={index}
              video={video}
              muted={isMuted}
              setIsMuted={setIsMuted}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={cx("swiper-button-next")}>
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </div>
  );
}

export default VideoList;
