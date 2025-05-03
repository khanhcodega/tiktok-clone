import { NavLink, useLocation } from "react-router-dom";
import className from "classnames/bind";
import style from "./Menu.module.scss";

const cx = className.bind(style);
function MenuItem({
  children,
  to,
  title,
  icon,
  iconActive,
  onlyIcon = false,
  onClick,
  className
}) {
  const location = useLocation();
  const isActive = to === location.pathname;
  
  return (
    <NavLink
      to={to}
      className={cx("menu-item", {
        active: isActive,
        [className]: className
      })}
      onClick={onClick}
    >
      <span className={cx("icon")}>
        {isActive && iconActive ? iconActive : icon}
      </span>
      {!onlyIcon && <span className={cx("title")}>{title}</span>}
    </NavLink>
  );
}

export default MenuItem;
