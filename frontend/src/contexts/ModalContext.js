import { createContext, useState, useCallback, useContext } from "react";

import {
  ModalLogin,
  ModalRegister,
  ModalProfile
} from "~/components/Layouts/components/Modal";

const MODAL_TYPES = {
  LOGIN: "login",
  SIGNUP: "signup",
  PROFILE: "profile"
};

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  const openLoginModal = useCallback(
    () => setActiveModal(MODAL_TYPES.LOGIN),
    []
  );
  const openSignupModal = useCallback(
    () => setActiveModal(MODAL_TYPES.SIGNUP),
    []
  );
  const openProfileModal = useCallback(
    () => setActiveModal(MODAL_TYPES.PROFILE),
    []
  );
  const closeModal = useCallback(() => setActiveModal(null), []);

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
      case MODAL_TYPES.PROFILE:
        return <ModalProfile onClose={closeModal} />;
      default:
        return null;
    }
  };

  const value = {
    openLoginModal,
    openSignupModal,
    openProfileModal,
    closeModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {renderModal()}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
