import classNames from "classnames/bind";
import style from "./CommentList.module.scss";

import CommentItem from "./CommentItem";
import CommentReply from "./CommentReply";
import Button from "../../Button";

const cx = classNames.bind(style);

function CommentList({ comments }) {
  return (
    <div className={cx("wrapper")}>
      {comments.map((comment, index) => (
        <div key={index}>
          <CommentItem comment={comment} />
          {comment.reply && <CommentReply comment={comment} />}
        </div>
      ))}

      
    </div>
  );
}

export default CommentList;
