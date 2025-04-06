import classNames from "classnames/bind";
import style from "./HeaderPopper.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);
function HeaderPopper({ children, onClose }) {
  return (
    <div className={cx("header")}>
      <h2 className={cx("title")}>{children}</h2>
      <button className={cx("btn-close")} onClick={onClose}>
        <span>
          <FontAwesomeIcon icon={faXmark} />
        </span>
      </button>
    </div>
  );
}

export default HeaderPopper;
