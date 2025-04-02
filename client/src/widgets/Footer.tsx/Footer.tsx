import React, { CSSProperties } from "react";
const styles: CSSProperties = {
  height: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderTop: "1px solid #e0e0e0",
};

export default function Footer(): React.JSX.Element {
  return <div style={styles}> © {new Date().getFullYear()}</div>;
}
