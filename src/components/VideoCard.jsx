import React from "react";
import { FaTrash } from "react-icons/fa";

export default function AdminVideoCard({
  type,
  videoData,
  videoClicked,
  deleteVideoClicked,
}) {
  return (
    <div className="video-card">
      {type === "admin" && (
        <FaTrash
          onClick={() => deleteVideoClicked(videoData)}
          style={{ color: "red" }}
        />
      )}

      <span onClick={() => videoClicked(videoData)}> {videoData.name}</span>
    </div>
  );
}
