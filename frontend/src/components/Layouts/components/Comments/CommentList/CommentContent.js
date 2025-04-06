import classNames from "classnames/bind";
import style from "./CommentList.module.scss";
import { IconLike } from "~/components/icons";
import { ListAccount } from "~/components/datafake/data";

const cx = classNames.bind(style);

function CommentContent({ comment }) {
  let userComment = ListAccount.find((user) => user.id === comment.userId);
  return (
    <div className={cx("comment-item")}>
      <img className={cx("avatar")} alt="avatar" src={userComment.avatar} />
      <div className={cx("comment-content")}>
        <span className={cx("name")}>{userComment.name}</span>
        <p className={cx("content")}>{comment.comment}</p>
        <div className={cx("actions")}>
          <div className={cx("comment-sub")}>
            <span className={cx("comment-date")}>1-2</span>
            <span className={cx("comment-date")}>Reply</span>
          </div>
          <div className={cx("likes")}>
            <IconLike />
            <span>comment.likes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentContent;
