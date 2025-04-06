import classNames from "classnames/bind";
import style from "./MenuItem.module.scss";
import Button from "../../Button";

const cx = classNames.bind(style);

function MenuItem({ data, isOnly }) {
  return (
    <Button
      className={cx("menu-item", { open: !isOnly })}
      leftIcon={data.icon}
      iconClassName={cx("icon", { open: !isOnly })}
    >
      {isOnly && data.label}
    </Button>
  );
}

export default MenuItem;
