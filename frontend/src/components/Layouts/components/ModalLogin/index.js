import classNames from "classnames/bind";
import style from "./ModalLogin.module.scss";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  IconApple,
  IconFb,
  IconGogoole,
  IconKakaoTalk,
  IconLine,
  IconQR,
  IconUser2
} from "~/components/icons";

const cx = classNames.bind(style);

function ModalLogin({ onClose }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <h2 className={cx("title")}>Log in to TikTok</h2>
        <Button className={cx("btn-close")} onClick={() => onClose(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <div className={cx("options")}>
          <Button leftIcon={<IconQR />} className={cx("btn")} outline text>
            Use QR code
          </Button>
          <Button leftIcon={<IconUser2 />} className={cx("btn")} outline text>
            Use phone / email / username
          </Button>
          <Button leftIcon={<IconFb />} className={cx("btn")} outline text>
            Continue with Facebook
          </Button>
          <Button leftIcon={<IconGogoole />} className={cx("btn")} outline text>
            Continue with Google
          </Button>
          <Button leftIcon={<IconLine />} className={cx("btn")} outline text>
            Continue with LINE
          </Button>
          <Button
            leftIcon={<IconKakaoTalk />}
            className={cx("btn")}
            outline
            text
          >
            Continue with KakaoTalk
          </Button>
          <Button leftIcon={<IconApple />} className={cx("btn")} outline text>
            Continue with Apple
          </Button>
        </div>
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
        <div className={cx("register")}>
          <div>Don’t have an account? </div>
          <a href="/" className={cx("register-link")}>
            <span>Sign up</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ModalLogin;
