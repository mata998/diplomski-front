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
    if (loggedIn) {
      getData();
    }
  }, [loggedIn]);

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
    <>
      {loggedIn && (
        <div className="my-courses">
          <h3>My courses</h3>
          <br />
          {myCourses.map((course) => (
            <div
              key={course.courseid}
              className="course"
              onClick={() => history.push(`/course/${course.courseid}`)}
            >
              {course.name}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
