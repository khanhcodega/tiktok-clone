import classNames from "classnames/bind";
import style from "./Following.module.scss";
import FollowingItem from "./FollowingItem";

const cx = classNames.bind(style);

function Following({}) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <FollowingItem />
        <FollowingItem />
        <FollowingItem />
        <FollowingItem />
        <FollowingItem />
        <FollowingItem />
        <FollowingItem />
      </div>
    </div>
  );
}

export default Following;
