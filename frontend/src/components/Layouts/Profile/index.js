import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";

import style from "./Profile.module.scss";
import Image from "../components/Image";
import { useAuth } from "~/contexts/AuthContext";
import Button from "../components/Button";
import { IconShare } from "~/components/icons";
import { useModal } from "~/contexts/ModalContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const cx = classNames.bind(style);
const TABS = ["Videos", "Favorites", "Liked"];
function Profile({}) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Videos");
  const actionListRef = useRef(null);
  const bottomLineRef = useRef(null);
  const { openProfileModal } = useModal();
  useEffect(() => {
    const container = actionListRef.current;
    const line = bottomLineRef.current;

    if (!container || !line) return;

    const activeButton = container.querySelector(
      `.${cx("btn-feed")}.${cx("active")}`
    );

    if (activeButton) {
      const { offsetLeft, offsetWidth } = activeButton;

      line.style.width = `${offsetWidth}px`;
      line.style.transform = `translateX(${offsetLeft}px)`;
    } else {
      line.style.width = "0px";
      line.style.transform = "translateX(0px)";
    }
  }, [activeTab, cx]);

  return (
    <>
      <div className={cx("wrapper")}>
        <header className={cx("header")}>
          <span className={cx("avatar")}>
            <Image src={`${API_URL}/avatar/${user.avatar}`} alt="avatar" />
          </span>
          <div className={cx("user-info")}>
            <div className={cx("info-item")}>
              <h1 className={cx("user-title")}>{user.name}</h1>
              <h2 className={cx("user-subtitle")}>{user.nickname}</h2>
            </div>
            <div className={cx("info-item")}>
              <Button
                onClick={() => openProfileModal()}
                primary
                className={cx("btn-edit", "btn")}
              >
                Edit profile
              </Button>
              <Button className={cx("btn-promote", "btn")}>Promote post</Button>
              <Button className={cx("btn-manage", "btn")}>
                <IconShare />
              </Button>
              <Button className={cx("btn-share", "btn")}>
                <IconShare />
              </Button>
            </div>
            <div className={cx("info-item")}>
              <div className={cx("count-info")}>
                <span className={cx("count-item")}>
                  <strong>0</strong> Following
                </span>
                <span className={cx("count-item")}>
                  <strong>0</strong> Following
                </span>
                <span className={cx("count-item")}>
                  <strong>0</strong> Following
                </span>
              </div>
            </div>
            <h2 className={cx("user-bio")}>No bio yet.</h2>
          </div>
        </header>
        <div className={cx("action")}>
          <div ref={actionListRef} className={cx("action-list", "feed")}>
            {TABS.map((tab) => (
              <Button
                key={tab}
                className={cx("btn-feed", { active: activeTab === tab })}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
            <div ref={bottomLineRef} className={cx("bottom-line")}></div>
          </div>
          <div className={cx("action-list", "segmented")}>
            <div className={cx("btn-segmented", "active")}>Latest</div>
            <div className={cx("btn-segmented")}>Popular</div>
            <div className={cx("btn-segmented")}>Oldest</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
