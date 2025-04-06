import React, { useState } from "react";
import { Link } from "react-router-dom";

import classNames from "classnames/bind";
import style from "./Sidebar.module.scss";

import images from "~/assets/images";
import {
  IconSearch,
  IconExplore,
  IconHome,
  IconFollowing,
  IconMore,
  IconUpload,
  IconUser,
  IconLive
} from "~/components/icons";
import Menu, { MenuItem } from "../../components/Menu";
import SearchResult from "~/components/Search";
import Button from "../../components/Button";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import { MenuActions } from "../../components/Actions";
import { MoreAction } from "~/components/datafake/data.js";

const fakeMenuData = MoreAction;

const cx = classNames.bind(style);

function Sidebar({setLogin}) {
  const [isVisible, setIsVisible] = useState(false);
  const [render, setRender] = useState(null);
  const handleToggleSearch = () => {
    if (render !== <SearchResult />) {
      setIsVisible(true);
      setRender(<SearchResult onClose={handleCloseVisible} />);
    } else {
      handleCloseVisible();
    }
  };

  const handleToggleMore = () => {
    if (render !== <MenuActions />) {
      setIsVisible(true);
      setRender(
        <MenuActions
          items={fakeMenuData}
          title="More"
          onClose={handleCloseVisible}
        />
      );
    } else {
      handleCloseVisible();
    }
  };

  const handleCloseVisible = () => {
    setRender(null);
    setIsVisible(false);
  };

  const srcLogo = isVisible ? images.logo2 : images.logo;
  return (
    <aside className={cx("wrapper", { open: isVisible })}>
      <div className={cx("inner")}>
        <Link to={"/"} className={cx("logo")}>
          <img src={srcLogo} alt="Tiktok" />
        </Link>

        <Button
          iconOnly={isVisible}
          leftIcon={<IconSearch />}
          onClick={handleToggleSearch}
          className={cx("btn-search")}
        >
          <input
            readOnly
            type="text"
            placeholder="Search"
            className={cx("input")}
          />
        </Button>

        <Menu>
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"For you"}
            icon={<IconHome />}
            to={"/"}
            active
          />
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"Explore"}
            to={"/explore"}
            icon={<IconExplore />}
          />
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"Following"}
            to={"/following"}
            icon={<IconFollowing />}
          />
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"Upload"}
            to={"/upload"}
            icon={<IconUpload />}
          />
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"LIVE"}
            icon={<IconLive />}
          />
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"Profile"}
            icon={<IconUser />}
          />
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"More"}
            icon={<IconMore />}
            onClick={handleToggleMore}
          />
        </Menu>

        {!isVisible && (
          <>
            <Button primary className={cx("btn-login")} onClick={() => setLogin(true)}>
              Log in
            </Button>

            <footer className={cx("footer")}>
              <Button className={cx("btn")}>Company</Button>
              <Button className={cx("btn")}>Program</Button>{" "}
              <Button className={cx("btn")}>Terms & Policies</Button>
              <h5 className={cx("footer-logo")}>© 2025 TikTok</h5>
            </footer>
          </>
        )}
      </div>
      {isVisible && <PopperWrapper>{render}</PopperWrapper>}
    </aside>
  );
}

export default Sidebar;
