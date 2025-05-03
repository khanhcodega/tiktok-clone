import classNames from "classnames/bind";
import style from "./Content.module.scss";
import Image from "../../components/Image";
import Button from "../../components/Button";
import images from "~/assets/images";
import { IconInspirations, IconQuality } from "~/components/icons";
import {
  faArrowsRotate,
  faCamera,
  faCheckCircle,
  faExclamationCircle,
  faFloppyDisk,
  faSpinner,
  faUpload
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProgressBar from "../../components/ProgressBar";
import { useAuth } from "~/contexts/AuthContext"; 
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const cx = classNames.bind(style);
const API_URL = process.env.REACT_APP_API_URL;
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_DESCRIPTION_LENGTH = 500;

function Content() {
  const { token, isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [postProgress, setPostProgress] = useState(0); 
  const [postStatus, setPostStatus] = useState("idle"); 
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState("");


  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);


  const handleSelectClick = () => {
    if (postStatus === "error" || postStatus === "success") {
      resetState();
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (fileInputRef.current) fileInputRef.current.value = ""; 
    if (file) {
      validateAndSetFile(file);
    }
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const validateAndSetFile = (file) => {
    setPostStatus("validating");
    setErrorMessage("");
    setSelectedFile(null);
    revokePreviewUrl(); 
    setDescription("");

    if (!file.type.startsWith("video/")) {
      setErrorMessage("Please select a valid video file (e.g., .mp4, .mov).");
      setPostStatus("error");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
      setPostStatus("error");
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file); 
    setPreviewUrl(localUrl);
    setPostStatus("ready");
    setErrorMessage(""); 
  };


  const handlePost = async () => {
    if (!selectedFile || !isAuthenticated || postStatus === "posting") {
      if (!isAuthenticated) setErrorMessage("Please log in to post.");
      else if (!selectedFile) setErrorMessage("No video file selected.");
      setPostStatus("error"); 
      return;
    }

    setPostStatus("posting");
    setPostProgress(0);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("description", description); 

    try {
      const response = await axios.post(
        `${API_URL}/api/videos/upload`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
           
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setPostProgress(Math.min(percentCompleted, 100));
          }
        }
      );

      setPostStatus("success");

      console.log("Post successful:", response.data);
      alert("Video posted successfully!");
    } catch (error) {
      console.error("Post failed:", error.response || error);
      setPostStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred during posting."
      );
      setPostProgress(0);
      
    }
  };


  const handleDiscard = () => {
    resetState();
  };

  const resetState = () => {
    setSelectedFile(null);
    revokePreviewUrl(); 
    setPostProgress(0);
    setPostStatus("idle");
    setErrorMessage("");
    setDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  
  const revokePreviewUrl = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };
  useEffect(() => {
    
    return () => {
      revokePreviewUrl();
    };
  }, []); 

  const showDetailsSection =
    postStatus === "ready" ||
    postStatus === "posting" ||
    postStatus === "error" ||
    postStatus === "success"; 
  const showInitialSelector =
    postStatus === "idle" ||
    postStatus === "validating" ||
    (postStatus === "error" && !selectedFile); 

  const showPostProgress = postStatus === "posting";
  const showSuccessMessage = postStatus === "success";

  return (
    <div className={cx("wrapper")}>
      <header className={cx("header")}>
        <Image className={cx("logo")} src="/favicon.ico" alt="Logo" />
      </header>
      <div className={cx("content")}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="video/*" 
          disabled={postStatus === "posting"}
        />
        {showDetailsSection && selectedFile && (
          <div className={cx("card-upload")}>
            <div className={cx("upload-info")}>
              <h4 className={cx("file-name")}>{selectedFile.name}</h4>
              <span
                className={cx("info-status", {
                  ready: postStatus === "ready",
                  posting: postStatus === "posting",
                  success: postStatus === "success",
                  error: postStatus === "error"
                })}
              >
                {postStatus === "ready" && "Ready to post"}
                {postStatus === "posting" && `Posting... ${postProgress}%`}
                {postStatus === "success" && (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} /> Posted
                  </>
                )}
                {postStatus === "error" && (
                  <>
                    <FontAwesomeIcon icon={faExclamationCircle} /> Post Failed
                  </>
                )}
              </span>
            </div>
            <div className={cx("actions")}>
              {(postStatus === "ready" || postStatus === "error") && (
                <Button
                  className={cx("btn")}
                  outline
                  text={false}
                  leftIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
                  onClick={handleSelectClick}
                >
                  Replace
                </Button>
              )}
            </div>
            {showPostProgress && (
              <div className={cx("progress-bar")}>
                <ProgressBar
                  width={postProgress}
                  thumb={false}
                  className={cx("progress")}
                />
              </div>
            )}
          </div>
        )}

        {showDetailsSection && selectedFile && (
          <>
            <h3 className={cx("details-title")}> Details</h3>
            {errorMessage &&
              postStatus !== "error" && ( 
                <div className={cx("error-message", "details-error")}>
                  <FontAwesomeIcon icon={faExclamationCircle} /> {errorMessage}
                </div>
              )}

            <div className={cx("details")}>
              <div className={cx("card", "card-description")}>
                <h4 className={cx("details-subtitle")}> Description</h4>
                <div className={cx("card-details")}>
                  <textarea
                    className={cx("detail-description")}
                    rows="10" 
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    disabled={
                      postStatus === "posting" || postStatus === "success"
                    }
                  />
                  <div className={cx("actions-description")}>
                    <div className={cx("operation")}>
                      <span className={cx("caption-operation")}>
                        # Hashtags
                      </span>
                      <span className={cx("caption-operation")}>@ Mention</span>
                    </div>

                    <div className={cx("operation")}>
                      <span
                        className={cx("word-count", {
                          limit: description.length >= MAX_DESCRIPTION_LENGTH
                        })}
                      >
                        {description.length}/{MAX_DESCRIPTION_LENGTH}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx("card")}>
                <h4 className={cx("details-subtitle")}>Preview</h4>
                <div className={cx("card-video")}>
                  <video
                    ref={videoPreviewRef}
                    controls
                    src={previewUrl || ""} 
                    key={previewUrl}
                    className={cx("video-preview-element")}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            <div className={cx("details-actions")}>
              <Button
                primary
                className={cx("btn-post")}
                onClick={handlePost}
                disabled={postStatus !== "ready" && postStatus !== "error"}
                leftIcon={
                  postStatus === "posting" ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faUpload} />
                  )
                }
              >
                {postStatus === "posting" ? "Posting..." : "Post"}{" "}
              </Button>
              <Button
                className={cx("btn-discard")}
                onClick={handleDiscard}
                disabled={postStatus === "posting" || postStatus === "success"}
              >
                Discard
              </Button>
            </div>
          </>
        )}

        {showInitialSelector && (
          <div className={cx("card")}>
            {postStatus === "error" && errorMessage && (
              <div className={cx("error-message")}>
                <FontAwesomeIcon icon={faExclamationCircle} /> {errorMessage}
              </div>
            )}

            <div className={cx("card-content")}>
              <div className={cx("select")}>
                <img src={images.upload} alt="logo upload" />
                <h2 className={cx("title")}>Select video to upload</h2>
                <span className={cx("description")}>
                  Or drag and drop it here
                </span>
                <Button
                  className={cx("btn-select")}
                  primary
                  onClick={handleSelectClick}
                  disabled={!isAuthenticated || postStatus === "validating"}
                >
                  {postStatus === "validating"
                    ? "Validating..."
                    : "Select video"}
                </Button>
              </div>
            </div>
            <div className={cx("suggestion-list")}>
              <div className={cx("suggestion-item")}>
                <span className={cx("suggestion-icon")}>
                  <FontAwesomeIcon icon={faCamera} />
                </span>
                <div className={cx("suggestion-text")}>
                  <h3 className={cx("suggestion-title")}>Size and duration</h3>
                  <span className={cx("suggestion-description")}>
                    Maximum size: {MAX_FILE_SIZE_MB} MB.
                  </span>
                </div>
              </div>
              <div className={cx("suggestion-item")}>
                <span className={cx("suggestion-icon")}>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </span>
                <div className={cx("suggestion-text")}>
                  <h3 className={cx("suggestion-title")}>File formats</h3>
                  <span className={cx("suggestion-description")}>
                    Recommended: “.mp4”. Other major formats are supported.
                  </span>
                </div>
              </div>
              <div className={cx("suggestion-item")}>
                <span className={cx("suggestion-icon")}>
                  <IconQuality />
                </span>
                <div className={cx("suggestion-text")}>
                  <h3 className={cx("suggestion-title")}>Video resolutions</h3>
                  <span className={cx("suggestion-description")}>
                    High-resolution recommended: 1080p, 1440p, 4K.
                  </span>
                </div>
              </div>
              <div className={cx("suggestion-item")}>
                <span className={cx("suggestion-icon")}>
                  <IconInspirations />
                </span>
                <div className={cx("suggestion-text")}>
                  <h3 className={cx("suggestion-title")}>Aspect ratios</h3>
                  <span className={cx("suggestion-description")}>
                    Recommended: 16:9 for landscape, 9:16 for vertical.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Content;
