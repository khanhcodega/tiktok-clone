import Wrapper from "./Wrapper";
import Form, { FormGroup } from "../../Form";
import React, { useState } from "react";

import useFormValidation from "~/hook/useFormValidation";
import { isEmail, isRequired, minLength, isComfirmed } from "~/utils/validator";

function ModalRegister({ onClose, ...props }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [errorSever, setErrorSever] = useState("");
  const initialValues = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: ""
  };

  // Định nghĩa các quy tắc validation
  const validator = {
    username: [isRequired],
    email: [isRequired, isEmail],
    password: [
      isRequired,
      (value) => minLength(6)(value, "Password must be at least 6 characters")
    ],
    passwordConfirm: [
      isRequired,
      (value) => isComfirmed(value, values.password, "Password does not match")
    ]
  };

  // Hàm xử lý khi submit thành công
  const handleFormSubmit = async (formData) => {
    const resultData = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
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
      setTimeout(() => {
        if (onClose) onClose();
        // Hoặc nếu bạn có nút chuyển sang login
        // if (onSwitchToLogin) onSwitchToLogin();
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
      title="Sign up to TikTok"
      footerText="Already have an account? "
      footerLink="Log in"
      {...props}
    >
      <Form
        btnText={"Sign up"}
        action={API_URL + "/api/auth"}
        method="POST"
        onSubmit={handleSubmit}
      >
        <FormGroup
          label="Username"
          name="username"
          error={(touched.username ? errors.username : undefined) || errorSever}
          type="text"
          placeholder="Email  d or phone number"
          id="username"
          value={values.username}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <FormGroup
          label="Email"
          name="email"
          type="email"
          error={touched.email ? errors.email : undefined}
          placeholder="Email or phone number"
          id="email"
          value={values.email}
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
        <FormGroup
          label="Password comfirm"
          name="passwordConfirm"
          type="password"
          error={touched.passwordConfirm ? errors.passwordConfirm : undefined}
          placeholder="Enter your password again"
          id="passwordConfirm"
          value={values.passwordConfirm}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </Form>
    </Wrapper>
  );
}

export default ModalRegister;
