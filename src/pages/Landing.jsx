import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { serverURL, shortenString } from "../utils/utils";
import { GlobalContext } from "../context/GlobalContext";

export default function Landing() {
  const { loggedIn } = useContext(GlobalContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getData();
  }, [loggedIn]);

  const getData = async () => {
    let res;

    if (loggedIn) {
      res = await axios.get(`${serverURL()}/api/courses/for-user`, {
        withCredentials: true,
      });
    } else {
      res = await axios.get(`${serverURL()}/api/courses`);
    }

    if (res.data.success) {
      console.log(res.data.data);
      setCourses(res.data.data);
    } else {
      console.log(res.data);
    }
  };

  const requestCourse = async (e, course) => {
    const answer = window.confirm(`Request course: ${course.name}?`);
    if (answer === false) {
      return;
    }

    const res = await axios.get(
      `${serverURL()}/api/courses/request-course/${course.courseid}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      e.target.className = "requested";
      e.target.innerHTML = "requested";
      console.log(res.data.data);
    } else {
      console.log(res.data);
    }
  };

  const courseType = (course) => {
    if (course.userid === null) {
      return (
        <div className="request" onClick={(e) => requestCourse(e, course)}>
          request
        </div>
      );
    }

    if (course.unlockedat === null) {
      return <div className="requested">requested</div>;
    }

    if (course.unlockedat !== null && course.finishedat === null) {
      return <div className="owned">owned</div>;
    }

    if (course.unlockedat !== null && course.finishedat !== null) {
      return <div className="finished">finished</div>;
    }
  };

  return (
    <div>
      <h3 className="text-align-center">All courses</h3>
      <br />
      <div>
        {courses.map((course) => (
          <div className="course-card" key={course.courseid}>
            <div className="title">{course.name}</div>
            <div className="container">
              <p className="desc">{shortenString(course.description, 150)}</p>

              {loggedIn && courseType(course)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
