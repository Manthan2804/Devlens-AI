import React from "react";

const fontDisplay = "'Space Grotesk', sans-serif";
const fontBody = "'Inter', sans-serif";

export default function PlaceholderPage({ label }) {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center text-center"
      style={{ background: "#ffffff", border: "1.5px dashed rgba(20,18,14,0.1)", padding: "80px 24px" }}
    >
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, color: "#15130e" }}>{label}</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13, color: "#a89f8a", marginTop: 8 }}>
        This section is next up on the build list.
      </p>
    </div>
  );
}