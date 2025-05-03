import HeaderPopper from "~/components/Popper/HeaderPopper";
import Header from "./Header";
import MenuItem from "./MenuItem";
import React, { useState } from "react";

import classNames from "classnames/bind";
import style from "./Actions.module.scss";
import { useAuth } from "~/contexts/AuthContext";
const cx = classNames.bind(style);

function MenuActions({ children, items = [], title, onClose }) {
  const [history, setHistory] = useState([{ data: items }]);
  const current = history[history.length - 1];
  const { logout, isAuthenticated } = useAuth();
  // const handleResetToFirstPage = () => setHistory((prev) => prev.slice(0, 1));
  const handleBack = () => setHistory((prev) => prev.slice(0, prev.length - 1));
  const handleMenuItemClick = (item) => {
    const isParent = !!item.children;
    const hasAction = !!item.action; // Kiểm tra xem có thuộc tính action không
    const hasLink = !!item.link;

    if (isParent) {
      // Xử lý khi có submenu
      setHistory((prev) => [
        ...prev,
        { title: item.title, data: item.children }
      ]);
    } else if (hasAction) {
      // Xử lý khi có action
      switch (item.action) {
        case "logout":
          window.location = "/";
          logout();
          if (onClose) onClose();
          break;
        default:
          break;
      }
    } else if (hasLink) {
      // Xử lý khi có link
      window.location.href = item.link;
      if (onClose) onClose();
    } else {
      console.log(`Clicked item without action/link: ${item.title}`);
      if (onClose) onClose();
    }
  };
  const filteredData = current.data.filter((item) => {
    if (item.requiresAuth === true) {
      return isAuthenticated; // Chỉ giữ lại nếu đã đăng nhập
    } else if (item.requiresAuth === false) {
      return !isAuthenticated; // Chỉ giữ lại nếu chưa đăng nhập
    } else {
      return true; // Luôn giữ lại nếu không có yêu cầu (public)
    }
  });
  return (
    <div className={cx("wrapper")}>
      {history.length > 1 ? (
        <Header title={current.title} onBack={handleBack} />
      ) : (
        <HeaderPopper onClose={onClose}>{title}</HeaderPopper>
      )}
      <ul className={cx("menu")}>
        {filteredData.map((item, index) => (
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
