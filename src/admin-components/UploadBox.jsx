import { useState } from "react";
import axios from "axios";
import {
  getAllFiles,
  getAllFileEntries,
  entriesToFiles,
} from "../utils/fileEntries";
import { serverURL } from "../utils/utils";

export default function UploadBox({ selectedFolder, getData }) {
  const [files, setFiles] = useState([]);

  const handleDrop = async (e) => {
    e.preventDefault();

    const uploadedFiles = await getAllFiles(e.dataTransfer.items);
    console.log(uploadedFiles);
    setFiles(uploadedFiles);
  };

  const uploadFiles = async () => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
      // formData.append("paths", file.fullPath);
      formData.append("paths", `${selectedFolder}/${file.fullPath}`);
    });

    // formData.append("selectedFolder", selectedFolder);

    try {
      const res = await axios.post(
        `${serverURL()}/api/admin/videos`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        getData();
        setFiles([]);
      } else {
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ width: "50vw" }}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          padding: "20px 50px",
          border: "1px dotted red",
          textAlign: "center",
        }}
      >
        Drag here
      </div>
      <div>
        {files.map((file) => (
          <div>{file.fullPath}</div>
        ))}
      </div>
      <button onClick={uploadFiles}>Upload</button>
    </div>
  );
}
