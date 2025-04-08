import React, { CSSProperties } from "react";
const styles: CSSProperties = {
  height: "91px",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderTop: "1px solid #e0e0e0",
  // background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
  // transition: "all 0.3s ease",
  // backdropFilter: "blur(9px)",
  backgroundColor: "black",
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
