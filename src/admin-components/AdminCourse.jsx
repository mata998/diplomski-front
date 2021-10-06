import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { serverURL } from "../utils/utils";
import AdminCourseMenu from "./AdminCourseMenu";
import UploadBox from "./UploadBox";

export default function AdminCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let res = await axios.get(`${serverURL()}/api/course/info/${courseId}`);

    if (res.data.success) {
      console.log(res.data.data);
      setCourse(res.data.data);
    } else {
      console.log(res);
    }

    res = await axios.get(`${serverURL()}/api/course/videos/${courseId}`, {
      withCredentials: true,
    });

    if (res.data.success) {
      setVideos(res.data.data);
      console.log(res.data.data);
    } else {
      console.log(res.data);
    }
  };

  const selectVideo = (video) => {
    console.log(video);
  };

  return (
    <div
      className="admin-container"
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <AdminCourseMenu videos={videos} selectVideo={selectVideo} />
      <UploadBox />
    </div>
  );
}
