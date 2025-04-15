import classNames from "classnames/bind";
import style from "./CommentList.module.scss";

import CommentItem from "./CommentItem";
import CommentReply from "./CommentReply";

const cx = classNames.bind(style);

function CommentList({ comments }) {
  return (
    <div className={cx("wrapper")}>
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index}>
            <CommentItem comment={comment} />
            {comment.reply && <CommentReply comment={comment} />}
          </div>
        ))
      ) : (
        <h5>No comments yet</h5>
      )}
    </div>
  );
}

export default CommentList;
