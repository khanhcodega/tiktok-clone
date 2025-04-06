import classNames from "classnames/bind";
import style from "./Upload.module.scss";




import Sidebar from "./Sidebar";
import Content from "./Content";

const cx = classNames.bind(style);

function Upload() {
  return (
    <div className={cx("wrapper")}>
      <Sidebar />
      <Content />
    </div>
  );
}

export default Upload;
