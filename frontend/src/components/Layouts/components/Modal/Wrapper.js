import classNames from "classnames/bind";
import style from "./Modal.module.scss";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

function Wrapper({
  onClose,
  title,
  children,
  footerText,
  footerLink,
  onSwitchModal
}) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <h2 className={cx("title")}>{title}</h2>
        <Button className={cx("btn-close")} onClick={() => onClose(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <div className={cx("options")}>{children}</div>
        <div className={cx("policy")}>
          <p className={cx("text")}>
            By continuing with an account located in
            <a href="/signup/country-selector"> Vietnam</a>, you agree to our
            <a href="https://www.tiktok.com/legal/terms-of-use?lang=en">
              <span> Terms of Service</span>
            </a>
            <span> and acknowledge that you have read our</span>
            <a href="https://www.tiktok.com/legal/privacy-policy?lang=en">
              <span> Privacy Policy</span>
            </a>
            .
          </p>
        </div>
        <div className={cx("footer")}>
          <div>{footerText} </div>
          <button className={cx("footer-link")} onClick={onSwitchModal}>
            {footerLink}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Wrapper;
