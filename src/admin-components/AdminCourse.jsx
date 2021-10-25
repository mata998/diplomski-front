import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { serverURL } from "../utils/utils";
import CourseMenu from "../components/CourseMenu";
import UploadBox from "./UploadBox";

export default function AdminCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [videos, setVideos] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let res = await axios.get(`${serverURL()}/api/courses/info/${courseId}`);

    if (res.data.success) {
      console.log(res.data.data);
      setCourse(res.data.data);
    } else {
      console.log(res);
    }

    res = await axios.get(`${serverURL()}/api/courses/videos/${courseId}`, {
      withCredentials: true,
    });

    if (res.data.success) {
      setVideos(res.data.data);
      console.log(res.data.data);
    } else {
      console.log(res.data);
      console.log("ovooo?");
      setVideos([]);
    }
  };

  const videoClicked = (video) => {
    console.log(video);
  };

  const folderClicked = (folderPath, e) => {
    console.log(folderPath);
    setSelectedFolder(folderPath);
  };

  const deleteVideoClicked = async (video) => {
    console.log(video);

    const answer = window.confirm(`Delete video: ${video.name}?`);

    if (answer === false) {
      return;
    }

    const res = await axios.delete(
      `${serverURL()}/api/admin/videos/${video.videoid}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      console.log(res.data);
      getData();
    } else {
      console.log(res);
      alert("Error: video was not deleted");
    }
  };

  const deleteFolderClicked = async (folderName, folderPath) => {
    const answer = window.confirm(`Delete folder ${folderName}?`);

    if (answer === false) {
      return;
    }

    const res = await axios.delete(
      `${serverURL()}/api/admin/folder?path=${folderPath}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      console.log(res.data);
      getData();
    } else {
      console.log(res);
      alert("Error folder was not deleted");
    }
  };

  return (
    <div
      className="admin-container"
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <CourseMenu
        type="admin"
        course={course}
        videos={videos}
        videoClicked={videoClicked}
        folderClicked={folderClicked}
        deleteVideoClicked={deleteVideoClicked}
        deleteFolderClicked={deleteFolderClicked}
      />
      <div>
        <div>Folder: {selectedFolder}</div>
        <UploadBox selectedFolder={selectedFolder} getData={getData} />
      </div>
    </div>
  );
}
