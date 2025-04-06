import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import style from "./Actions.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(style);
function MenuItem({ onClick, data }) {
  const hasChildren = data.children && data.children.length > 0;
  return (
    <li className={cx("menu-item")} onClick={onClick}>
      {data.link ? (
        <Link to={data.link} className={cx("content")}>
          {data.title}
        </Link>
      ) : (
        <button className={cx("content")} >
          {data.title}
        </button>
      )}
      {hasChildren && (
        <span className={cx("icon")}>
          <FontAwesomeIcon icon={faAngleRight} />
        </span>
      )}
    </li>
  );
}

export default MenuItem;
