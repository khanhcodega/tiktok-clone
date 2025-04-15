import classNames from "classnames/bind";
import style from "./Form.module.scss";
import { useState } from "react";

const cx = classNames.bind(style);

function FormGroup({
  children,
  name,
  label,
  error,
  ...props
}) {

  return (
    <div
      className={cx("form-group", {
        invalid: typeof error === "string" && error
      })}
    >
      <label htmlFor={name} className={cx("label")}>
        {label}
      </label>
      {children || (
        <input
          name={name}
          className={cx("form-control")}
          {...props}
        />
      )}
      <span className={cx("error")}>{error}</span>
    </div>
  );
}

export default FormGroup;
