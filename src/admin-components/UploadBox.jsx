import { useState } from "react";
import axios from "axios";
import { getAllFiles } from "../utils/fileEntries";
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
    if (files.length === 0) {
      alert("Drag files");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
      // formData.append("paths", file.fullPath);
      formData.append("paths", `${selectedFolder}/${file.fullPath}`);
      console.log(`${selectedFolder}/${file.fullPath}`);
    });

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
    <div className="upload-box">
      <div
        className="drag-here"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        Drag here
      </div>
      <div className="upload-items scroll">
        {files.map((file) => (
          <div className="upload-item" key={file.fullPath}>
            {file.fullPath}
          </div>
        ))}
      </div>
      <div className="btn-container">
        <div className="btn-round" onClick={uploadFiles}>
          Upload
        </div>
        <div className="btn-round" onClick={() => setFiles([])}>
          Discard
        </div>
      </div>
    </div>
  );
}
