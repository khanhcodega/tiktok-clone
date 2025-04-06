import classNames from "classnames/bind";
import style from "./Comments.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import CommentList from "./CommentList/index";

const cx = classNames.bind(style);

function Comments({ comments, setShowComments }) {
  const countTotalComments = (comments) => {
    return comments.reduce((total, comment) => {
      const replyCount = comment.reply ? comment.reply.length : 0;
      return total + 1 + replyCount;
    }, 0);
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h4 className={cx("title")}>
          Comments ({countTotalComments(comments)})
        </h4>

        <Button
          className={cx("btn-close")}
          onClick={() => setShowComments((prev) => !prev)}
          capsule
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </div>
      <div className={cx("content")}>
        <CommentList comments={comments} />
      </div>
      <div className={cx("footer")}>
        <Button className={cx("btn-comment")}>Log in to comment</Button>
      </div>
    </div>
  );
}

export default Comments;
