import { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router";
import { serverURL } from "../utils/utils";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import CourseMenu from "../components/CourseMenu";

export default function Course() {
  const { courseId } = useParams();
  const { loggedIn } = useContext(GlobalContext);
  const [course, setCourse] = useState({});
  const [videos, setVideos] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (!loggedIn) {
      history.push("/");
    }

    getData();
  }, []);

  const getData = async () => {
    let res = await axios.get(`${serverURL()}/api/courses/info/${courseId}`);

    if (res.data.success) {
      console.log(res.data.data);
      setCourse(res.data.data);
    } else {
      console.log(res.data);
    }

    res = await axios.get(`${serverURL()}/api/courses/videos/${courseId}`, {
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
    setSelectedPath(video.path);
    setSelectedName(video.name);
  };

  return (
    <div>
      <h1>{course.name}</h1>
      <br />

      <h5 style={{ textAlign: "left" }}>{selectedName}</h5>
      <br />
      <div
        style={{
          display: "flex",
          gap: "200px",
        }}
      >
        <video
          width="800px"
          src={`${serverURL()}/api/courses/video?name=${selectedPath}`}
          controls
        />
        <CourseMenu videos={videos} selectVideo={selectVideo} />
      </div>
    </div>
  );
}
