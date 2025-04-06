import classNames from "classnames/bind";
import style from "./Search.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const cx = classNames.bind(style);

function Sugget({data}) {
  return (
      <>
        <h4 className={cx("title")}>You may like</h4>
        <ul className={cx("list")}>
            {data.map((item, index) => {
                return (
                <li key={index} >
                    <Link href={item.url} className={cx("link")}>
                    <span className={cx("icon")}>
                        {item.status === "trend"
                        ? <FontAwesomeIcon
                            icon={faArrowTrendUp}
                            className={cx("icon-trend")}
                            />
                        : <span className={cx("icon-default")} />}
                    </span>
                    <span className={cx("text")}>
                        {item.title[0].toUpperCase() + item.title.slice(1)}
                    </span>
                    </Link>
                </li>
                );
            })}
        </ul>
    </>
  );
}

export default Sugget;
