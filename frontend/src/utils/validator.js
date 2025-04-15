const isRequired = (value, errorMessage = "This field is required") => {
  if (value === null || value === undefined || value.trim() === "") {
    return errorMessage;
  }
  return undefined;
};

const isEmail = (value, errorMessage = "Invalid email") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailRegex.test(value)) {
    return errorMessage;
  }
  return undefined;
};

const minLength =
  (min) =>
  (value, errorMessage = `Password must be at least ${min} characters`) => {
    if (value && value.length < min) {
      return errorMessage;
    }
    return undefined;
  };

const maxLength =
  (max) =>
  (value, errorMessage = `Password must be at most ${max} characters `) => {
    if (value && value.length > max) {
      return errorMessage;
    }
    return undefined;
  };

// Ví dụ về validator kết hợp nhiều luật
const composeValidators =
  (...validators) =>
  (value, allValues) =>
    validators.reduce(
      (error, validator) => error || validator(value, allValues),
      undefined
    );

// Ví dụ về validator tùy chỉnh phụ thuộc vào trường khác
const mustMatch =
  (otherFieldName, errorMessage = "Value does not match") =>
  (value, allValues) => {
    if (value !== allValues[otherFieldName]) {
      return errorMessage;
    }
    return undefined;
  };

const isComfirmed = (
  value,
  password,
  errorMessage = "Value does not match"
) => {
  if (value !== password) {
    return errorMessage;
  }
  return undefined;
};
export {
  isRequired,
  isEmail,
  minLength,
  maxLength,
  composeValidators,
  mustMatch,
  isComfirmed
};
