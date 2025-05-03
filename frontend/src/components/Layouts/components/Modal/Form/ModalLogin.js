import classNames from "classnames/bind";
import style from "./Modal.module.scss";
import { useState } from "react";

import Form, { FormGroup } from "../../Form";
import Button from "../../Button";
import {
  IconApple,
  IconFb,
  IconGogoole,
  IconKakaoTalk,
  IconLine,
  IconQR,
  IconUser2
} from "~/components/icons";
import Wrapper from "./Wrapper";
import useFormValidation from "~/hook/useFormValidation";
import { isRequired } from "~/utils/validator";
import { useAuth } from "~/contexts/AuthContext";
const API_URL = process.env.REACT_APP_API_URL;
const cx = classNames.bind(style);

function ModalLogin({ onClose, ...props }) {
  const [errorSever, setErrorSever] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const { login } = useAuth(); // Get login function and state

  const initialValues = {
    username: "",
    password: ""
  };

  // Định nghĩa các quy tắc validation
  const validator = {
    username: [isRequired],
    password: [isRequired]
  };

  // Hàm xử lý khi submit thành công
  const handleFormSubmit = async (formData) => {
    const resultData = {
      username: formData.username,
      password: formData.password
    };

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resultData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      // alert("Login successful!");
      login(formData.username, formData.password);
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (err) {
      setErrorSever(err.message || "Registration failed. Please try again.");
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation(initialValues, validator, handleFormSubmit);

  return (
    <Wrapper
      onClose={onClose}
      title="Log in to TikTok"
      footerText="Don't have an account? "
      footerLink="Sign up"
      {...props}
    >
      {!loginForm ? (
        <>
          <Button leftIcon={<IconQR />} className={cx("btn")} outline text>
            Use QR code
          </Button>
          <Button
            leftIcon={<IconUser2 />}
            className={cx("btn")}
            outline
            text
            onClick={() => setLoginForm(true)}
          >
            Use phone / email / username
          </Button>
          <Button leftIcon={<IconFb />} className={cx("btn")} outline text>
            Continue with Facebook
          </Button>
          <Button leftIcon={<IconGogoole />} className={cx("btn")} outline text>
            Continue with Google
          </Button>
          <Button leftIcon={<IconLine />} className={cx("btn")} outline text>
            Continue with LINE
          </Button>
          <Button
            leftIcon={<IconKakaoTalk />}
            className={cx("btn")}
            outline
            text
          >
            Continue with KakaoTalk
          </Button>
          <Button leftIcon={<IconApple />} className={cx("btn")} outline text>
            Continue with Apple
          </Button>
        </>
      ) : (
        <Form
          btnText={"Log in"}
          action={API_URL + "/api/auth"}
          method="POST"
          onSubmit={handleSubmit}
        >
          <FormGroup
            label="Username"
            name="username"
            error={
              (touched.username ? errors.username : undefined) || errorSever
            }
            type="text"
            placeholder="Email  d or phone number"
            id="username"
            value={values.username}
            onBlur={handleBlur}
            onChange={handleChange}
          />

          <FormGroup
            label="Password"
            name="password"
            type="password"
            error={touched.password ? errors.password : undefined}
            placeholder="Enter your password"
            id="password"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Form>
      )}
    </Wrapper>
  );
}

export default ModalLogin;
