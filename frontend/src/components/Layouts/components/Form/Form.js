import classNames from "classnames/bind";
import style from "./Form.module.scss";
import Button from "../Button";

const cx = classNames.bind(style);
function Form({ children, action, method, btnText, onSubmit }) {
  return (
    <div className={cx("wrapper")}>
      <form action={action} method={method}>
        {children}

        <Button className={cx("btn-submit")} type="submit" onClick={onSubmit}>
          {btnText}
        </Button>
      </form>
    </div>
  );
}

export default Form;
