import classNames from "classnames/bind";
import style from "./ModalProfile.module.scss";
import { forwardRef, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Image from "../../Image";
import Button from "../../Button";
import { useAuth } from "~/contexts/AuthContext";

const cx = classNames.bind(style);
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const ModalProfile = forwardRef(({ onClose }, ref) => {
  const { user, token } = useAuth();
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const fileInputRef = useRef(null);
  const [isChanged, setIsChanged] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const changed =
      username !== user.username ||
      name !== user.name ||
      bio !== (user.bio || "") ||
      selectedFile !== null;
    setIsChanged(changed);
  }, [username, name, bio, selectedFile, user]);

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeBio = (event) => {
    setBio(event.target.value);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (png, jpg, jpeg).");
        return;
      }
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveChanges = async () => {
    if (!isChanged) return;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("bio", bio);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/auth/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        onClose();
      } else {
      }
    } catch (err) {
      console.error("Profile Update Error:", err);
    } finally {
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  return (
    <div className={cx("container")}>
      <div className={cx("wrapper")}>
        <header className={cx("header")}>
          <h2 className={cx("header-title")}>Edit profile</h2>
          <Button className={cx("btn-close")} onClick={() => onClose()}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </header>
        <div className={cx("content")}>
          <div className={cx("item")}>
            <h3 className={cx("title")}>Profile photo</h3>
            <div className={cx("item-content")}>
              <span className={cx("avatar")} onClick={handleAvatarClick}>
                <Image src={`${API_URL}/avatar/${user.avatar}`} />
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
          </div>
          <div className={cx("item")}>
            <h3 className={cx("title")}>Username</h3>
            <div className={cx("item-content")}>
              <input
                className={cx("input")}
                onChange={handleChangeUsername}
                value={username}
              />
              <span
                className={cx("description")}
              >{`${API_URL}/@${username}`}</span>
              <span className={cx("sub-description")}>
                Usernames can only contain letters, numbers, underscores, and
                periods. Changing your username will also change your profile
                link.
              </span>
            </div>
          </div>
          <div className={cx("item")}>
            <h3 className={cx("title")}>Name</h3>
            <div className={cx("item-content")}>
              <input
                className={cx("input")}
                onChange={handleChangeName}
                value={name}
              />
              <span className={cx("sub-description")}>
                Your nickname can only be changed once every 7 days.
              </span>
            </div>
          </div>
          <div className={cx("item")}>
            <h3 className={cx("title")}>Bio</h3>
            <div className={cx("item-content")}>
              <textarea
                placeholder="Bio"
                className={cx("input", "textarea")}
                cols={10}
                value={bio}
                onChange={handleChangeBio}
              />
              <span className={cx("count")}>0/80</span>
            </div>
          </div>
        </div>
        <footer className={cx("footer")}>
          <Button
            className={cx("btn-cancel", "btn")}
            outline
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            className={cx("btn-save", "btn")}
            disabled={isChanged}
            
            onClick={handleSaveChanges}
          >
            Save
          </Button>
        </footer>
      </div>
    </div>
  );
});

export default ModalProfile;
