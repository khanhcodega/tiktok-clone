import Sidebar from "./Sidebar";
import styles from "./DefaultLayout.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import Button from "../components/Button";
import { IconLogin } from "~/components/icons";
import { ModalLogin, ModalRegister } from "../components/Modal";

const cx = classNames.bind(styles);
const MODAL_TYPES = {
  LOGIN: "login",
  SIGNUP: "signup"
};
function DefaultLayout({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  const openLoginModal = () => setActiveModal(MODAL_TYPES.LOGIN);
  const openSignupModal = () => setActiveModal(MODAL_TYPES.SIGNUP);
  const closeModal = () => setActiveModal(null);

  const renderModal = () => {
    switch (activeModal) {
      case MODAL_TYPES.LOGIN:
        return (
          <ModalLogin onClose={closeModal} onSwitchModal={openSignupModal} />
        );
      case MODAL_TYPES.SIGNUP:
        return (
          <ModalRegister onClose={closeModal} onSwitchModal={openLoginModal} />
        );
      default:
        return null;
    }
  };
  return (
    <div className={cx("wrapper")}>
      <Sidebar setLogin={openLoginModal} />

      <div className={cx("content")}>{children}</div>

      {/* <div className={cx("login")}>
        <Button leftIcon={<IconLogin />}> Log in</Button>
      </div> */}

      {renderModal()}
    </div>
  );
}

export default DefaultLayout;
