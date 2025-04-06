import { Link } from "react-router-dom";
import styles from "./AccountItem.module.scss";
import classNames from "classnames/bind";
import React from "react";
import "tippy.js/dist/tippy.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function AccountItem({ data }) {
  return (
    <Link to={`/@${data.nickname}`} className={cx("wrapper")}>
      <div className={cx("info-box")}>
        <img className={cx("avatar")} src={data.avatar} alt={data.name} />

        <div className={cx("info")}>
          <p className={cx("name")}>
            {data.nickname}

            {data.tick &&
              <span className={cx("tick")}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>}
          </p>
          <span className={cx("nickname")}>
            {data.name}
          </span>
        </div>
      </div>
      {/* <div className={cx("actions")}>
        <span className={cx("icon-more")}>
            <IconMore />
        </span>
      </div> */}
    </Link>
  );
}

export default AccountItem;

// setTimeout(() => {
//   debugger;
// }, 2000);
