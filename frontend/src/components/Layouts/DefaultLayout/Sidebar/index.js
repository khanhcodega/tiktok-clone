import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";

import style from "./Sidebar.module.scss";
import { useAuth } from "~/contexts/AuthContext";
import images from "~/assets/images";
import {
  IconSearch,
  IconExplore,
  IconHome,
  IconFollowing,
  IconMore,
  IconUpload,
  IconUser,
  IconLive,
  IconFriends,
  IconActivity,
  IconMessages,
  IconHomeActive,
  IconExploreActive,
  IconFollowingActive,
  IconFriendsActive,
  IconActivityActive,
  IconMessagesActive
} from "~/components/icons";
import Menu, { MenuItem } from "../../components/Menu";
import SearchResult from "~/components/Search";
import Button from "../../components/Button";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import { MenuActions } from "../../components/Actions";
import { MoreAction } from "~/components/datafake/data.js";
import { useModal } from "~/contexts/ModalContext";


const SIDEBAR_BREAKPOINT = 1024;
const fakeMenuData = MoreAction;

const cx = classNames.bind(style);
const API_URL = process.env.REACT_APP_API_URL;

function Sidebar({ }) {
  const { user, isAuthenticated } = useAuth();
const {openLoginModal} = useModal()

  const [isVisible, setIsVisible] = useState(false);
  const [render, setRender] = useState(null);

  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth < SIDEBAR_BREAKPOINT
  );
  useEffect(() => {
    const handleResize = () => {
      const currentlySmall = window.innerWidth < SIDEBAR_BREAKPOINT;
      if (currentlySmall !== isSmallScreen) {
        setIsSmallScreen(currentlySmall);

        setIsVisible(currentlySmall);
        setRender(null);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isSmallScreen]);
  const handleToggleSearch = () => {
    if (render !== <SearchResult />) {
      setIsVisible(true);
      setRender(<SearchResult onClose={handleCloseVisible} />);
    } else {
      handleCloseVisible();
    }
  };

  const handleToggleMore = useCallback(() => {
    if (render?.type !== MenuActions) {
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
  }, [render]);

  const handleCloseVisible = useCallback(() => {
    setRender(null);
    setIsVisible(isSmallScreen);
  }, [isSmallScreen]);

  const srcLogo = isVisible ? images.logo2 : images.logo;
  return (
    <aside className={cx("wrapper", { open: isVisible })}>
      <div className={cx("inner")}>
        <div className={cx("header")}>
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
        </div>

        <Menu>
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"For you"}
            icon={<IconHome />}
            to={"/"}
            iconActive={<IconHomeActive />}
          />
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"Explore"}
            to={"/explore"}
            icon={<IconExplore />}
            iconActive={<IconExploreActive />}
          />
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"Following"}
            to={"/following"}
            icon={<IconFollowing />}
            iconActive={<IconFollowingActive />}
          />
          {isAuthenticated && (
            <MenuItem
              className={cx("menu-item")}
              onlyIcon={isVisible}
              title={"Friends"}
              to={"/Friends"}
              icon={<IconFriends />}
              iconActive={<IconFriendsActive />}
            />
          )}
          <MenuItem
            className={cx("menu-item")}
            onlyIcon={isVisible}
            title={"Upload"}
            to={isAuthenticated ? "/upload" : undefined}
            onClick={!isAuthenticated ? () => openLoginModal() : undefined}
            icon={<IconUpload />}
          />
          {isAuthenticated && (
            <MenuItem
              className={cx("menu-item")}
              onlyIcon={isVisible}
              title={"Activity"}
              icon={<IconActivity />}
              to={"/activity"}
              iconActive={<IconActivityActive />}
            />
          )}
          {isAuthenticated && (
            <MenuItem
              className={cx("menu-item")}
              onlyIcon={isVisible}
              title={"Messages"}
              to={"/messages"}
              icon={<IconMessages />}
              iconActive={<IconMessagesActive />}
            />
          )}
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
            to={"/profile"}
            icon={
              isAuthenticated ? (
                <img alt="avatar" src={`${API_URL}/avatar/${user.avatar}`} />
              ) : (
                <IconUser />
              )
            }
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
            {!isAuthenticated ? (
              <Button
                primary
                className={cx("btn-login")}
                onClick={() => openLoginModal()}
              >
                Log in
              </Button>
            ) : (
              <div className={cx("following-accounts")}>
                <h3 className={cx("following-title")}>Following accounts </h3>
                <span className={cx("following-text")}>
                  Accounts you follow will appear here
                </span>
              </div>
            )}

            <footer className={cx("footer")}>
              <Button className={cx("btn")}>Company</Button>
              <Button className={cx("btn")}>Program</Button>{" "}
              <Button className={cx("btn")}>Terms & Policies</Button>
              <h5 className={cx("footer-logo")}>© 2025 TikTok</h5>
            </footer>
          </>
        )}
      </div>
      {render && <PopperWrapper>{render}</PopperWrapper>}
    </aside>
  );
}

export default Sidebar;
