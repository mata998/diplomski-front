import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { serverURL } from "../utils/utils";
import { GlobalContext } from "../context/GlobalContext";

export default function MyCourses() {
  const { loggedIn } = useContext(GlobalContext);
  const [myCourses, setMyCourses] = useState([]);

  const history = useHistory();

  useEffect(() => {
    if (!loggedIn) {
      history.push("/");
    }

    getData();
  }, []);

  const getData = async () => {
    const res = await axios.get(`${serverURL()}/api/courses/unlocked`, {
      withCredentials: true,
    });

    if (res.data.success) {
      console.log(res.data.data);
      setMyCourses(res.data.data);
    } else {
      console.log(res.data);
    }
  };

  return (
    <div>
      <h3>My courses</h3>
      <br />
      {myCourses.map((course) => (
        <h5
          key={course.courseid}
          style={{ padding: "10px 0", cursor: "pointer" }}
          onClick={() => history.push(`/course/${course.courseid}`)}
        >
          {course.name}
        </h5>
      ))}
    </div>
  );
}
