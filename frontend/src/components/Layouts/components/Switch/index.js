import classNames from "classnames/bind";
import style from "./Switch.module.scss";
import { useState } from "react";

const cx = classNames.bind(style);

function Switch({ checked = false, onChange }) {
  const [isOn, setIsOn] = useState(checked);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    if (onChange) {
      onChange(!isOn);
    }
  };
  return (
    <div className={cx("switch", isOn ? "on" : "off")} onClick={toggleSwitch}>
      <div className={cx("switch-handle")}></div>
    </div>
  );
}

export default Switch;
