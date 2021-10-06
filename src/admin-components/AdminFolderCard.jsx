import React from "react";

export default function AdminFolderCard({
  folderName,
  folderPath,
  folderClicked,
  subFolders,
}) {
  return (
    <div>
      <div onClick={() => folderClicked(folderPath)}>{folderName}</div>
      <div style={{ paddingLeft: "20px" }}>{subFolders}</div>
    </div>
  );
}
