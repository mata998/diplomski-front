import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { serverURL } from "../utils/utils";
import { GlobalContext } from "../context/GlobalContext";

export default function Landing() {
  const { user } = useContext(GlobalContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await axios.get(`${serverURL()}/api/course`);

    if (res.data.success) {
      console.log(res.data.data);
      setCourses(res.data.data);
    } else {
      console.log(res.data);
    }
  };

  return (
    <div>
      <h3>Available courses</h3>
      <br />
      <div>
        {courses.map((course) => (
          <h5 style={{ padding: "10px 0" }} key={course.courseid}>
            {course.name}
          </h5>
        ))}
      </div>
    </div>
  );
}
