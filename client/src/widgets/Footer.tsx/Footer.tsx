import { fonts } from "@/shared/styles/fonts";
import React, { CSSProperties } from "react";
const styles: CSSProperties = {
  height: "91px",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
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
  zIndex: 1000,
  gap: "8px"
};

const copyrightStyle: CSSProperties = {
  ...fonts.delaGothicOne,
  fontSize: "1.2rem",
  fontWeight: "bold"
};

const creatorsContainerStyle: CSSProperties = {
  display: "flex",
  gap: "20px",
  fontSize: "0.9rem",
  fontWeight: "normal",
  opacity: 0.8,
  position: "absolute",
  left: "40px",
  bottom: "20px"
};

const creatorsLabelStyle: CSSProperties = {
  ...fonts.delaGothicOne,
  color: "white",
  minWidth: "1px"
};

const creatorsNamesStyle: CSSProperties = {
  ...fonts.delaGothicOne,
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

export default function Footer(): React.JSX.Element {
  return (
    <div style={styles}>
      <div style={copyrightStyle}>© {new Date().getFullYear()} MotionLab</div>
      <div style={creatorsContainerStyle}>
        <div style={creatorsLabelStyle}>Created by</div>
        <div style={creatorsNamesStyle}>
          <div>Sergey B</div>
          <div>Vladimir M</div>
          <div>Maksim K</div>
        </div>
      </div>
    </div>
  );
}
