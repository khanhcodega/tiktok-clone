import { forwardRef } from "react";
import styles from "./Image.module.scss";
import classNames from "classnames";
const Image = forwardRef(({ alt, src, className, ...props }, ref) => {
  return (
    <img
      ref={ref}
      alt={alt}
      src={src}
      {...props}
      className={classNames(styles.wapper, className)}
    />
  );
});

export default Image;
