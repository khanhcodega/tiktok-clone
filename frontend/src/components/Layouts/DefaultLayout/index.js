import Sidebar from "./Sidebar";
import styles from "./DefaultLayout.module.scss";
import classNames from "classnames/bind";
import { ModalProvider, useModal } from "~/contexts/ModalContext";

const cx = classNames.bind(styles);
function LayoutContent({ children }) {

  const { openLoginModal } = useModal();

  return (
    <div className={cx("wrapper")}>
      <Sidebar  />
      <div className={cx("content")}>{children}</div>
    </div>
  );
}

function DefaultLayout({ children }) {

  return (
    <ModalProvider>
      <LayoutContent>{children}</LayoutContent>
    </ModalProvider>
  );
}

export default DefaultLayout;
