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
import { useAuth } from "~/context/AuthContext"; // Adjust path to your AuthContext
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const cx = classNames.bind(style);
const API_URL = process.env.REACT_APP_API_URL;
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_DESCRIPTION_LENGTH = 500;

function Content() {
  const { token, isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null); // Stores the File object
  const [previewUrl, setPreviewUrl] = useState(null); // For local preview
  const [postProgress, setPostProgress] = useState(0); // Progress for the final post action
  const [postStatus, setPostStatus] = useState("idle"); // 'idle', 'validating', 'ready', 'posting', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState("");
  // No need for uploadedVideoData until after successful post
  // const [uploadedVideoData, setUploadedVideoData] = useState(null);

  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  // --- File Selection & Validation ---

  const handleSelectClick = () => {
    // Reset if coming from error or success state
    if (postStatus === "error" || postStatus === "success") {
      resetState();
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
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
    revokePreviewUrl(); // Clean up previous preview URL if any
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

    // Validation successful
    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file); // Create local preview URL
    setPreviewUrl(localUrl);
    setPostStatus("ready"); // Ready to enter details and post
    setErrorMessage(""); // Clear any previous errors
  };

  // --- Post Logic ---

  const handlePost = async () => {
    if (!selectedFile || !isAuthenticated || postStatus === "posting") {
      if (!isAuthenticated) setErrorMessage("Please log in to post.");
      else if (!selectedFile) setErrorMessage("No video file selected.");
      setPostStatus("error"); // Set status to error if invalid state
      return;
    }

    setPostStatus("posting");
    setPostProgress(0);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("description", description); // Send description along with the file

    try {
      const response = await axios.post(
        `${API_URL}/api/videos/upload`, // Use the single upload endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            // Calculate percentage for the combined post/upload action
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setPostProgress(Math.min(percentCompleted, 100));
          }
        }
      );

      // Handle Success
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
      // Keep selectedFile and description so user can retry without re-selecting/re-typing
    }
  };

  // --- Discard / Reset ---

  const handleDiscard = () => {
    // No need to call backend as nothing is saved yet
    resetState();
  };

  const resetState = () => {
    setSelectedFile(null);
    revokePreviewUrl(); // Clean up object URL
    setPostProgress(0);
    setPostStatus("idle");
    setErrorMessage("");
    setDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Effects ---
  // Clean up object URL when component unmounts or file changes
  const revokePreviewUrl = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };
  useEffect(() => {
    // This is the cleanup function that runs when the component unmounts
    // or before the effect runs again if dependencies change (which they don't here).
    return () => {
      revokePreviewUrl();
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // --- Render Logic ---
  const showDetailsSection =
    postStatus === "ready" ||
    postStatus === "posting" ||
    postStatus === "error" ||
    postStatus === "success"; // Show details once file is selected/validated
  const showInitialSelector =
    postStatus === "idle" ||
    postStatus === "validating" ||
    (postStatus === "error" && !selectedFile); // Show selector if idle, validating, or error *before* file selection
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
          accept="video/*" // Only allow video files
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

        {/* Details Section */}
        {showDetailsSection && selectedFile && (
          <>
            <h3 className={cx("details-title")}> Details</h3>
            {/* Display posting error message here */}
            {errorMessage &&
              postStatus !== "error" && ( // Show non-upload errors here
                <div className={cx("error-message", "details-error")}>
                  <FontAwesomeIcon icon={faExclamationCircle} /> {errorMessage}
                </div>
              )}

            <div className={cx("details")}>
              <div className={cx("card","card-description")}>
                <h4 className={cx("details-subtitle")}> Description</h4>
                <div className={cx("card-details")}>
                  <textarea
                    className={cx("detail-description")}
                    rows="10" // Adjust as needed
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
                    src={previewUrl || ""} // <--- Here!
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
