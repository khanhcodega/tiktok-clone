import classNames from "classnames/bind";
import style from "./Video.module.scss";
const cx = classNames.bind(style);

function VideoAction({ icon, label, onClick }) {
  return (
    <div className={cx("actions")} onClick={onClick} >
      <span className={cx("icon")}>{icon}</span>
      <strong>{label}</strong>
    </div>
  );
}

export default VideoAction;
