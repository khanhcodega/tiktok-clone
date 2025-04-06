import classNames from "classnames/bind";
import style from "./Drawer.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Header from "../../DefaultLayout/Sidebar/Actions/Header";
import MenuItem from "../../DefaultLayout/Sidebar/Actions/MenuItem";

const cx = classNames.bind(style);
function Drawer({ children, onClose, title }) {
  return <div className={cx("container")}>{children}</div>;
}

export default Drawer;
