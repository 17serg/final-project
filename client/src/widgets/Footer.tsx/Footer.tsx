import React, { CSSProperties } from "react";
const styles: CSSProperties = {
  height: "91px",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderTop: "1px solid #e0e0e0",
  backgroundColor: "rgb(42, 41, 223)",
  color: "white",
  fontWeight: "bold",
  fontSize: "1.2rem",
  boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.1)",
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000
};

export default function Footer(): React.JSX.Element {
  return <div style={styles}> © {new Date().getFullYear()} MotionLab</div>;
}
