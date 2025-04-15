import classNames from "classnames/bind";
import style from "./Comments.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Button from "../Button";
import CommentList from "./CommentList/index";
import { useAuth } from "~/context/AuthContext";
import { useRef, useState } from "react";
import { comment } from "postcss";
const cx = classNames.bind(style);

const API_URL = process.env.REACT_APP_API_URL;

function Comments({ comments, setShowComments, videoId }) {
  const { user, isAuthenticated, token } = useAuth();
  const [valueComment, setValueComment] = useState("");
  const [error, setError] = useState(null);
  const handleChangeComment = (event) => {
    const newValue = event.target.value;
    setValueComment(newValue);
  };

  
  const inputRef = useRef();
  const handleComment = async (valueComment) => {
    if (!videoId) {
      console.error("Comments component is missing videoId prop!");
      setError("Cannot post comment: Video ID is missing.");
      return; // Don't proceed if videoId is missing
    }
    const trimmedComment = valueComment.trim();
    if (!trimmedComment) {
      setError("Comment cannot be empty.");
      return; // Don't proceed if comment is empty
    }
    const resultData = {
      text: trimmedComment
    };
    const headers = {
      "Content-Type": "application/json",
      // --- FIX: Add Authorization Header ---
      Authorization: `Bearer ${token}`
      // ------------------------------------
    };
    try {
      const response = await fetch(`${API_URL}/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(resultData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      console.log("success");
    } catch (err) {
      console.error(err.message || "Registration failed. Please try again.");
    }

    setValueComment("");
    inputRef.current.value = "";
  };

  const countTotalComments = (comments) => {
    return comments.reduce((total, comment) => {
      const replyCount = comment.reply ? comment.reply.length : 0;
      return total + 1 + replyCount;
    }, 0);
  };

  const totalComment = countTotalComments(comments)
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h4 className={cx("title")}>
          Comments {totalComment > 0 && `(${totalComment})`}
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
        {!isAuthenticated ? (
          <Button className={cx("btn-comment")}>Log in to comment</Button>
        ) : (
          <div className={cx("add-comment")}>
            <input
              className={cx("value-comment")}
              value={valueComment}
              placeholder="Add comment..."
              onChange={handleChangeComment}
              ref={inputRef}
            />
            <Button
              className={cx("btn-post", { active: valueComment.length > 0 })}
              onClick={() => handleComment(valueComment)}
            >
              Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comments;
