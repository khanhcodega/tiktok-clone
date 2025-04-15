import { useCallback, useState } from "react";

const useFormValidation = (initialValues = {}, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm thực hiện validation cho một trường hoặc toàn bộ form
  const runValidation = useCallback(
    (currentValues) => {
      const newErrors = {};
      for (const fieldName in validate) {
        const rules = validate[fieldName];
        const value = currentValues[fieldName];
        if (rules && Array.isArray(rules)) {
          for (const rule of rules) {
            const errorMessage = rule(value);
            if (errorMessage) {
              newErrors[fieldName] = errorMessage;
              break;
            }
          }
        }
      }
      return newErrors;
    },
    [validate]
  );

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: newValue
    }));
  }, []);

  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true
      }));

      const fieldErrors = runValidation(values);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldErrors[name] || null // Chỉ cập nhật lỗi của trường này
      }));
    },
    [runValidation, values]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      // Đánh dấu tất cả các trường là đã chạm vào để hiển thị lỗi nếu có
      const allTouched = Object.keys(validate).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      const formErrors = runValidation(values);
      setErrors(formErrors);

      // Kiểm tra nếu không có lỗi
      if (Object.keys(formErrors).length === 0) {
        try {
          await onSubmit(values); // Gọi hàm submit được truyền vào
        } catch (error) {
          console.error("Submit error:", error);
          // Có thể set lỗi chung cho form ở đây nếu cần
        } finally {
          setIsSubmitting(false);
        }
      } else {
        // console.log("Form có lỗi:", formErrors);
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, runValidation]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    isSubmitting,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues, // Có thể cần để cập nhật giá trị từ bên ngoài
    setErrors
  };
};

export default useFormValidation;
