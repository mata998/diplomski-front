import React from "react";

export default function AdminVideoCard({ videoData, selectVideo }) {
  return (
    <div onClick={() => selectVideo(videoData)} style={{ color: "lightblue" }}>
      {videoData.name}
    </div>
  );
}
