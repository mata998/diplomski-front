import { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "../utils/utils";

export default function AdminAllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await axios.get(`${serverURL()}/api/admin/creators`, {
      withCredentials: true,
    });

    if (res.data.success) {
      console.log(res.data.data);
      setUsers(res.data.data);
    } else {
      console.log(res);
    }
  };

  return (
    <div className="admin-container">
      <div>All creators</div>

      <br />

      <div style={{ width: "40vw" }}>
        {users.map((user) => (
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            key={user.userid}
          >
            <div>{user.name}</div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div>Delete</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
