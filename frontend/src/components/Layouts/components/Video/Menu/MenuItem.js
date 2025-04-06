import { NavLink } from "react-router-dom";
import className from "classnames/bind";
import style from "./Menu.module.scss";

const cx = className.bind(style);
function MenuItem({
  children,
  to,
  title,
  icon,
  active = false,
  onlyIcon = false,
  onClick
}) {
  return (
    <NavLink to={to} className={cx("menu-item", { active })} onClick={onClick}>
      <span className={cx("icon")}>{icon}</span>
      {!onlyIcon && <span className={cx("title")}>{title}</span>}
    </NavLink>
  );
}

export default MenuItem;
