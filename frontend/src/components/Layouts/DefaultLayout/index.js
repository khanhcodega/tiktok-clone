import Sidebar from "./Sidebar";
import styles from "./DefaultLayout.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import Button from "../components/Button";
import { IconLogin } from "~/components/icons";
import ModalLogin from "../components/ModalLogin";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const [login, setLogin] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);

  return (
    <div className={cx("wrapper")}>
      <Sidebar setLogin={setModalLogin} />

      <div className={cx("content")}>{children}</div>
      {login && (
        <div className={cx("login")}>
          <Button leftIcon={<IconLogin />}> Log in</Button>
        </div>
      )}
      {modalLogin && <ModalLogin onClose={setModalLogin} />}
    </div>
  );
}

export default DefaultLayout;
