import classNames from "classnames/bind";
import style from "./Button.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(style);

function Button({
  to,
  href,
  children,
  leftIcon,
  rightIcon,
  primary = false,
  capsule = false,
  outline = false,
  className,
  iconClassName,
  onClick,
  text = false,
  iconOnly = false,
  ...passProps
}) {
  let Comp = "button";
  const classes = cx("wrapper", {
    [className]: className,
    primary,
    capsule,
    outline
  });

  const props = {
    onClick,
    ...passProps
  };

  if (to) {
    props.to = to;
    Comp = Link;
  } else if (href) {
    props.href = href;
    Comp = "a";
  }

  return (
    <Comp className={classes} {...props}>
      {leftIcon && <span className={cx("icon")}>{leftIcon}</span>}
      {!iconOnly && <span className={cx("title", {text})}>{children}</span>}
      {rightIcon && <span className={cx("icon")}>{rightIcon}</span>}
    </Comp>
  );
}

export default Button;
