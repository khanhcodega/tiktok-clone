import classNames from "classnames/bind";
import style from "./Content.module.scss";
import Image from "../../components/Image";
import Button from "../../components/Button";
import images from "~/assets/images";
import { IconInspirations, IconQuality } from "~/components/icons";
import { faCamera, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const cx = classNames.bind(style);

function Content() {
  return (
    <div className={cx("wrapper")}>
      <header className={cx("header")}>
        <Image className={cx("logo")} src="/favicon.ico" alt="Logo" />
      </header>
      <div className={cx("content")}>
        <div className={cx("card")}>
          {false && (
            <div className={cx("card-header")}>
              <span className={cx("text")}>
                A video you were editing wasn’t saved. Continue editing?
              </span>

              <div className={cx("actions")}>
                <Button className={cx("btn")} outline>
                  Discard
                </Button>
                <Button className={cx("btn")} outline>
                  Continue
                </Button>
              </div>
            </div>
          )}
          <div className={cx("card-content")}>
            <div className={cx("select")}>
              <img src={images.upload} alt="logo upload" />
              <h2 className={cx("title")}>Select video to upload</h2>
              <span className={cx("description")}>
                Or drag and drop it here
              </span>
              <Button className={cx("btn-select")} primary>
                Select video
              </Button>
            </div>
          </div>
          <div className={cx("suggestion-list")}>
            <div className={cx("suggestion-item")}>
              <span className={cx("suggestion-icon")}>
                <FontAwesomeIcon icon={faCamera} />
              </span>
              <div className={cx("suggestion-text")}>
                <h3 className={cx("suggestion-title")}>Size and duration</h3>
                <span className={cx("suggestion-description")}>
                  Maximum size: 30 GB, video duration: 60 minutes.
                </span>
              </div>
            </div>
            <div className={cx("suggestion-item")}>
              <span className={cx("suggestion-icon")}>
                <FontAwesomeIcon icon={faFloppyDisk} />
              </span>
              <div className={cx("suggestion-text")}>
                <h3 className={cx("suggestion-title")}>File formats</h3>
                <span className={cx("suggestion-description")}>
                  Recommended: “.mp4”. Other major formats are supported.
                </span>
              </div>
            </div>
            <div className={cx("suggestion-item")}>
              <span className={cx("suggestion-icon")}>
                <IconQuality />
              </span>
              <div className={cx("suggestion-text")}>
                <h3 className={cx("suggestion-title")}>Video resolutions</h3>
                <span className={cx("suggestion-description")}>
                  High-resolution recommended: 1080p, 1440p, 4K.
                </span>
              </div>
            </div>
            <div className={cx("suggestion-item")}>
              <span className={cx("suggestion-icon")}>
                <IconInspirations />
              </span>
              <div className={cx("suggestion-text")}>
                <h3 className={cx("suggestion-title")}>Aspect ratios</h3>
                <span className={cx("suggestion-description")}>
                  Recommended: 16:9 for landscape, 9:16 for vertical.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
