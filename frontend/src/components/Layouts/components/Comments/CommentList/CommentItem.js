import classNames from "classnames/bind";
import style from "./CommentList.module.scss";

import { IconLike, IconMore, IconReport } from "~/components/icons";
import { ListAccount } from "~/components/datafake/data";
import Button from "../../Button";
import CustomTooltip from "../../CustomTooltip";
import Menu, { MenuItem } from "../../Menu";

const cx = classNames.bind(style);

const API_URL = process.env.REACT_APP_API_URL;

function CommentItem({ comment }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        // year: "numeric",
        day: "numeric",
        month: "numeric"
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  return (
    <div className={cx("comment-item")}>
      <img
        className={cx("avatar")}
        alt="avatar"
        src={`${API_URL}/avatar/${comment.user.avatar}`}
      />
      <div className={cx("comment-content")}>
        <div className={cx("user")}>
          <span className={cx("name")}>{comment.user.name}</span>
          <CustomTooltip
            placement="bottom"
            content={
              <Menu>
                <MenuItem
                  title="Report"
                  icon={<IconReport />}
                  className={cx("btn-report")}
                />
              </Menu>
            }
          >
            <Button className={cx("btn-more")}>
              <IconMore />
            </Button>
          </CustomTooltip>
        </div>
        <p className={cx("content")}>{comment.text}</p>
        <div className={cx("actions")}>
          <div className={cx("comment-sub")}>
            <span className={cx("comment-date")}>
              {formatDate(comment.createdAt)}
            </span>
            <span className={cx("comment-date")}>Reply</span>
          </div>
          <div className={cx("likes")}>
            <IconLike />
            <span>{comment.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
