import classNames from "classnames/bind";
import style from "./CommentList.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import CommentItem from "./CommentItem";
import { useState } from "react";

const cx = classNames.bind(style);

function CommentReply({ comment }) {
  const [visibleReplies, setVisibleReplies] = useState(0);
  const totalReplies = comment.reply.length;

  console.log(visibleReplies, "---", totalReplies);

  const handleShowMoreReplies = () => {
    setVisibleReplies((prev) => Math.min(prev + 3, totalReplies));
  };

  const hanleHideReplies = () => {
    setVisibleReplies(0);
  };

  return (
    <div className={cx("reply-wrapper")}>
      {comment.reply.slice(0, visibleReplies).map((reply, replyIndex) => (
        <CommentItem comment={reply} key={replyIndex} isReply={true} />
      ))}

      <div className={cx("reply")}>
        <div className={cx("spacer")} />

        <div className={cx("options")}>
          {visibleReplies < totalReplies && (
            <div className={cx("view-reply")} onClick={handleShowMoreReplies}>
              <span>
                View {totalReplies - visibleReplies}{" "}
                {visibleReplies === 0 ? "replies" : "more"}
              </span>
              <span className={cx("icon")}>
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </div>
          )}
          {visibleReplies > 0 && (
            <div className={cx("view-reply")} onClick={hanleHideReplies}>
              <span>Hide</span>
              <span className={cx("icon")}>
                <FontAwesomeIcon icon={faChevronUp} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentReply;
