import { useState, useRef } from "react";
import UploadImageCard from "./UploadImageCard";
import styles from "./UploadPage.module.css";

export default function PeraUpload() {
  const [files, setFiles] = useState([]);
  const [imgSrc, setImgSrc] = useState([]);
  const fileUploadRef = useRef();

  const removePic = (ind) => {
    const newFiles = files.filter((file, index) => {
      return index !== ind;
    });
    setFiles(newFiles);
  };

  const uploadImages = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(fileUploadRef.current.files);

    // formData.append("files[]", fileUploadRef.current.files);
    files.forEach((file, index) => {
      formData.append("files", file);
    });
    console.log(formData);
    try {
      const res = await fetch("http://localhost:3001/restaurants/upload", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDrop = (e) => {
    // TODO: Handle only images and files (not folders)
    e.preventDefault();
    // console.log(e.dataTransfer.items[0].getAsFile());
    const items = [...e.dataTransfer.items].map((item) => {
      console.log(item.getAsFile());
      return item.getAsFile();
    });
    addFiles(items);
  };

  const addFiles = (filesArr) => {
    filesArr.forEach((file) => {
      console.log(file);
      file.imgSrc = URL.createObjectURL(file);
      console.log(file);
    });
    console.log(filesArr);
    // setFiles(filesArr);
    // setFiles((prev) => {
    //   return [...prev, filesArr];
    // });
    setFiles([...files, ...filesArr]);
  };

  return (
    <div>
      <h1>Cao iz uploada</h1>

      <form>
        <div
          className={styles.dragAndDropContainer}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        ></div>
        <label htmlFor="file" className={styles.uploadLabel}>
          Select Images
          <input
            type="file"
            name="file"
            id="file"
            multiple
            ref={fileUploadRef}
            className={styles.uploadInput}
            onChange={(e) => {
              const filesArr = Array.from(e.target.files);
              addFiles(filesArr);
            }}
          />
        </label>

        <button onClick={uploadImages}>Upload</button>
      </form>
      <div className={styles.container}>
        {files.map((file, index) => (
          <UploadImageCard
            key={index}
            imgSrc={file.imgSrc}
            removeImage={() => {
              removePic(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
