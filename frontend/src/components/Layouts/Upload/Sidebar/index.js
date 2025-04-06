import classNames from "classnames/bind";
import style from "./Sidebar.module.scss";
import Button from "../../components/Button";
import { IconAdd, IconAnalytics, IconComment, IconCreator, IconFeedback, IconHome, IconInspirations, IconPosts, IconSound } from "~/components/icons";
import Menu, { MenuItem } from "../../components/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(style);

function Sidebar() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <Button className={cx("btn-logo")}>
          <img src="/image.png" alt="logo" />
        </Button>
      </div>
      <div className={cx("content")}>
        <Button className={cx("btn-upload")} primary leftIcon={<IconAdd />}>
          Upload
        </Button>

        <div className={cx("menu")}>
          <span className={cx("text-title")}>manage</span>
          <Menu>
            <MenuItem
              className={cx("menu-item")}
              // onlyIcon={isVisible}
              title={"Home"}
              icon={<IconHome />}
              to={"/"}
            />
            <MenuItem
              className={cx("menu-item")}
              // onlyIcon={isVisible}
              title={"Posts"}
              icon={<IconPosts />}
              to={"/"}
            />
            <MenuItem
              className={cx("menu-item")}
              // onlyIcon={isVisible}
              title={"Analytics"}
              icon={<IconAnalytics />}
              to={"/"}
            />
            <MenuItem
              className={cx("menu-item")}
              // onlyIcon={isVisible}
              title={"Comments"}
              icon={<IconComment />}
              to={"/"}
            />
          </Menu>
        </div>
        <div className={cx("menu")}>
          <span className={cx("text-title")}>tools</span>
          <Menu>
            <MenuItem
              className={cx("menu-item")}
              // onlyIcon={isVisible}
              title={"Inspirations"}
              icon={<IconInspirations />}
              to={"/"}
            />
            <MenuItem
              className={cx("menu-item")}
              // onlyIcon={isVisible}
              title={"Creator Academy"}
              icon={<IconCreator />}
              to={"/"}
            />
            <MenuItem
              className={cx("menu-item")}
              // onlyIcon={isVisible}
              title={"Unlimited sound"}
              icon={<IconSound />}
              to={"/"}
            />
          </Menu>
        </div>
        <div className={cx("menu")}>
          <span className={cx("text-title")}>other</span>
          <Menu>
            <MenuItem
              className={cx("menu-item")}
              // onlyIcon={isVisible}
              title={"Feedback"}
              icon={<IconFeedback />}
              to={"/"}
            />
          </Menu>
        </div>
      </div>
      <div className={cx("footer")}>
        <Button
          className={cx("btn-logout")}
          leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}
        >
          Back to TikTok
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
