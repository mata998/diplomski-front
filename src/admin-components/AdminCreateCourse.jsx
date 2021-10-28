import { useState } from "react";
import axios from "axios";
import { serverURL } from "../utils/utils";
import { useHistory } from "react-router";

export default function AdminCreateCourse() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();

  const createCourse = async () => {
    if (name === "" || description === "") {
      alert("Enter data");
      return;
    }

    const courseData = {
      name: name,
      description: description,
    };

    const res = await axios.post(
      `${serverURL()}/api/admin/create-course`,
      courseData,
      { withCredentials: true }
    );

    if (res.data.success) {
      console.log(res.data);
      history.push("/admin/courses");
    } else {
      console.log(res.data.err);
      alert(`Error course not created`);
    }
  };

  return (
    <div className="create-course">
      <h4>Create course</h4>

      <br />

      <div>Name: </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <div>Description:</div>
      <textarea
        // cols="30"
        rows="5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <br />

      <div className="create-btn" onClick={createCourse}>
        Create
      </div>
    </div>
  );
}
