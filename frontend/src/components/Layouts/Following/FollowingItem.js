import classNames from "classnames/bind";
import style from "./Following.module.scss";
import Button from "../components/Button";
import Image from "../components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

function FollowingItem({ className, data }) {
  return (
    <div className={cx("wrapper-item", { [className]: className })}>
      <div className={cx("content-item")}>
        <img
          src="https://p16-sign-va.tiktokcdn.com/tos-maliva-i-e1os8tt47a-us/3d8e5273f1484c2a8ef9f403a6d68610~tplv-photomode-zoomcover:480:480.jpeg?lk3s=b59d6b55&x-expires=1743861600&x-signature=riU17hdLQxweuiG2A5bUMmtks1E%3D&shp=b59d6b55&shcp=-"
          alt="avatar"
        />
      </div>
      <div className={cx("info-item")}>
        <div className={cx("avatar")}>
          <Image
            src="https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/7317079833937182753~tplv-tiktokx-cropcenter:100:100.jpeg?dr=14579&refresh_token=4a73d1ae&x-expires=1743861600&x-signature=teI6ijaviuguZOFB15NItFu9jQ4%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=b59d6b55&idc=my"
            alt="avatar"
          />
        </div>
        <h3 className={cx("username")}>Trấn Thành</h3>
        <h4 className={cx("user-subtitle")}>
          <span className={cx("nickname")}>tranthanh123</span>
          <span className={cx("tick")}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
        </h4>
        <Button className={cx("btn-following")} primary>
          Following
        </Button>
      </div>
    </div>
  );
}

export default FollowingItem;
