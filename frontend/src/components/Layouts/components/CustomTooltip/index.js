import classNames from "classnames/bind";
import style from "./CustomTooltip.module.scss";
import { useFloating, offset, flip, shift, arrow } from "@floating-ui/react";
import React, { useRef, useState, useEffect } from "react";

const cx = classNames.bind(style);

function CustomTooltip({
  children,
  content,
  placement = "top",
  setArrow = true
}) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  const tooltipRef = useRef(null);
  const {
    refs,
    floatingStyles,
    placement: actualPlacement,
    middlewareData
  } = useFloating({
    placement,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })]
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        !refs.reference.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, refs.reference]);
  const arrowStyles = {
    left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : "",
    top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : "",
    right: "",
    bottom: ""
  };

  if (actualPlacement.startsWith("top")) {
    arrowStyles.bottom = "-5px";
  } else if (actualPlacement.startsWith("bottom")) {
    arrowStyles.top = "-5px ";
  } else if (actualPlacement.startsWith("left")) {
    arrowStyles.right = "-5px";
  } else if (actualPlacement.startsWith("right")) {
    arrowStyles.left = "-5px";
  }

  return (
    <div className={cx("wrapper")} ref={refs.setReference}>
      <div ref={refs.setReference} onClick={() => setOpen((prev) => !prev)}>
        {children}
      </div>
      {open && (
        <div
          ref={(el) => {
            refs.setFloating(el);
            tooltipRef.current = el; // Gán tooltipRef vào phần tử tooltip
          }}
          style={floatingStyles}
          className={cx("content")}
        >
          {content}
          {setArrow && (
            <div
              ref={arrowRef}
              className={cx("arrow")}
              style={arrowStyles}
            ></div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomTooltip;
