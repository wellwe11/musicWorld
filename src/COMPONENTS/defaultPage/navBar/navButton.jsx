import classes from "./navArea.module.scss";
import { useRef, useEffect, useState } from "react";
import React from "react";

const NavButton = ({ children, onClick, externalClass }) => {
  const btnRef = useRef(null);
  const spanRef = useRef(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { width, height } = e.target.getBoundingClientRect();

      const offsetX = e.offsetX;
      const offsetY = e.offsetY;

      const left = `${(offsetX / width) * 100}%`;
      const top = `${(offsetY / height) * 100}%`;

      spanRef.current.animate(
        { left, top },
        { duration: 250, fill: "forwards" }
      );
    };

    btnRef.current?.addEventListener("mousemove", handleMouseMove);

    return () => {
      btnRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={classes.navButtonContainer}
      onClick={() => setButtonClicked(true)}
      onBlur={() => setButtonClicked(false)}
    >
      <button ref={btnRef} onClick={onClick} className={externalClass}>
        <div className={classes.insideButtonWrapper}>{children}</div>
        <span className={classes.mouseDot} ref={spanRef} />
      </button>
    </div>
  );
};

export default NavButton;
