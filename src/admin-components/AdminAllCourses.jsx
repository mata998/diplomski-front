import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../utils/utils";
import { GlobalContext } from "../context/GlobalContext";

export default function AdminAllCourses() {
  const { loggedIn } = useContext(GlobalContext);
  const [courses, setCourses] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      getData();
    }
  }, []);

  const getData = async () => {
    const res = await axios.get(`${serverURL()}/api/courses`);

    if (res.data.success) {
      console.log(res.data.data);
      setCourses(res.data.data);
    } else {
      console.log(res);
    }
  };

  const deleteCourse = async ({ courseid, name }) => {
    const answer = window.confirm(`Delete course: ${name}?`);

    if (answer === false) {
      return;
    }

    const res = await axios.delete(
      `${serverURL()}/api/admin/courses/${courseid}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      console.log(res.data);
      getData();
    } else {
      console.log(res);
      alert("Error course was not deleted");
    }
  };

  return (
    <div className="all-courses">
      <h4>All courses</h4>

      <br />

      <div>
        {courses.map((course) => (
          <div key={course.courseid} className="course">
            <div
              className="course-name"
              onClick={() => history.push(`/admin/course/${course.courseid}`)}
            >
              {course.name}
            </div>

            <div className="delete-btn" onClick={() => deleteCourse(course)}>
              Delete
            </div>
          </div>
        ))}
        <div
          className="new-course"
          onClick={() => history.push("/admin/create-course")}
        >
          + New course
        </div>
      </div>
    </div>
  );
}
