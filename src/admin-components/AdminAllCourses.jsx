import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../utils/utils";

export default function AdminAllCourses() {
  const [courses, setCourses] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getData();
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
      `${serverURL()}/api/admin/delete-course/${courseid}`,
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
    <div className="admin-container">
      <h4>All courses</h4>

      <br />

      <div>
        {courses.map((course) => (
          <div
            key={course.courseid}
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "20vw",
            }}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => history.push(`/admin/course/${course.courseid}`)}
            >
              {course.name}
            </div>
            <div
              style={{ color: "rgb(255, 176, 176)", cursor: "pointer" }}
              onClick={() => deleteCourse(course)}
            >
              Delete
            </div>
          </div>
        ))}
        <div
          style={{
            marginTop: "35px",
            cursor: "pointer",
          }}
        >
          <Link to="/admin/create-course">+ New course</Link>
        </div>
      </div>
    </div>
  );
}
