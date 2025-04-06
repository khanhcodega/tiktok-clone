import HeaderPopper from "~/components/Popper/HeaderPopper";
import Header from "./Header";
import MenuItem from "./MenuItem";
import React, { useState } from "react";

import classNames from "classnames/bind";
import style from "./Actions.module.scss";

const cx = classNames.bind(style);

function MenuActions({ children, items = [], title, onClose }) {
  const [history, setHistory] = useState([{ data: items }]);
  const current = history[history.length - 1];

  // const handleResetToFirstPage = () => setHistory((prev) => prev.slice(0, 1));
  const handleBack = () => setHistory((prev) => prev.slice(0, prev.length - 1));
  const handleMenuItemClick = (item) => {
    if (item.children) {
      setHistory((prev) => [
        ...prev,
        { title: item.title, data: item.children }
      ]);
      console.log(history);
    } else {
      window.location.href = item.link;
    }
  };

  return (
    <div className={cx("wrapper")}>
      {history.length > 1 ? (
        <Header title={current.title} onBack={handleBack} />
      ) : (
        <HeaderPopper onClose={onClose}>{title}</HeaderPopper>
      )}
      <ul className={cx("menu")}>
        {current.data.map((item, index) => (
          <MenuItem
            data={item}
            key={index}
            onClick={() => handleMenuItemClick(item)}
          />
        ))}
        {children}
      </ul>
    </div>
  );
}

export default MenuActions;
