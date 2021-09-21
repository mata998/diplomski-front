import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { serverURL } from "../utils/utils";
import axios from "axios";
import CourseMenu from "../components/CourseMenu";

export default function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [videos, setVideos] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let res = await axios.get(`${serverURL()}/api/course/info/${courseId}`);

    if (res.data.success) {
      console.log(res.data.data);
      setCourse(res.data.data);
    } else {
      console.log(res.data);
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

  return (
    <div>
      <h1>{course.name}</h1>
      <br />
      <div
        style={{
          display: "flex",
          gap: "200px",
        }}
      >
        <video
          width="800px"
          src={`${serverURL()}/api/course/video?name=${selectedPath}`}
          controls
        />
        <CourseMenu videos={videos} setSelectedPath={setSelectedPath} />
      </div>
    </div>
  );
}
