import { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router";
import { serverURL } from "../utils/utils";
import { GlobalContext } from "../context/GlobalContext";
import CourseMenu from "../components/CourseMenu";
import axios from "axios";

export default function Course() {
  const { courseId } = useParams();
  const { loggedIn } = useContext(GlobalContext);
  const [course, setCourse] = useState({});
  const [videos, setVideos] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      getData();
    }
  }, [loggedIn]);

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

  const videoClicked = (video) => {
    setSelectedPath(video.path);
    setSelectedName(video.name);
  };

  const folderClicked = (folderPath, e) => {
    if (e && e.target) {
      e.target.parentElement.parentElement.nextSibling.classList.toggle(
        "hidden"
      );
    }
    console.log(folderPath);
  };

  return (
    <>
      {loggedIn && (
        <div>
          <h1>{course.name}</h1>
          <br />

          <h5 style={{ textAlign: "left" }}>{selectedName}</h5>
          <br />
          <div
            style={{
              display: "flex",
              gap: "200px",
              alignItems: "flex-start",
            }}
          >
            <video
              // width="800px"
              height="400px"
              src={`${serverURL()}/api/courses/video?name=${selectedPath}`}
              controls
            />

            <CourseMenu
              course={course}
              videos={videos}
              videoClicked={videoClicked}
              folderClicked={folderClicked}
            />
          </div>
        </div>
      )}
    </>
  );
}
