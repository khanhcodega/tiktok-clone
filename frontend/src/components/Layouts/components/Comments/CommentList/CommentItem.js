import classNames from "classnames/bind";
import style from "./CommentList.module.scss";

import { IconLike, IconMore, IconReport } from "~/components/icons";
import { ListAccount } from "~/components/datafake/data";
import Button from "../../Button";
import CustomTooltip from "../../CustomTooltip";
import Menu, { MenuItem } from "../../Menu";

const cx = classNames.bind(style);

function CommentItem({ comment }) {
  console.log(comment.reply);

  let userComment = ListAccount.find((user) => user.id === comment.userId);

  return (
    <div className={cx("comment-item")}>
      <img className={cx("avatar")} alt="avatar" src={userComment.avatar} />
      <div className={cx("comment-content")}>
        <div className={cx("user")}>
          <span className={cx("name")}>{userComment.name}</span>
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
        <p className={cx("content")}>{comment.comment}</p>
        <div className={cx("actions")}>
          <div className={cx("comment-sub")}>
            <span className={cx("comment-date")}>1-2</span>
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
