import React from "react";

export default function AdminVideoCard({
  videoData,
  videoClicked,
  deleteVideoClicked,
}) {
  return (
    <div style={{ color: "lightblue", cursor: "pointer" }}>
      <i onClick={() => deleteVideoClicked(videoData)} style={{ color: "red" }}>
        d
      </i>
      <span onClick={() => videoClicked(videoData)}> {videoData.name}</span>
    </div>
  );
}
