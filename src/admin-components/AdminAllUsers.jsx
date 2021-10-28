import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { serverURL } from "../utils/utils";
import { GlobalContext } from "../context/GlobalContext";

export default function AdminAllUsers() {
  const { loggedIn } = useContext(GlobalContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      getData();
    }
  }, []);

  const getData = async () => {
    const res = await axios.get(`${serverURL()}/api/admin/users`, {
      withCredentials: true,
    });

    if (res.data.success) {
      console.log(res.data.data);
      setUsers(res.data.data);
    } else {
      console.log(res);
    }
  };

  const deleteUser = async ({ userid, name }) => {
    const answer = window.confirm(`Delete user: ${name}?`);

    if (answer === false) {
      return;
    }

    const res = await axios.delete(`${serverURL()}/api/admin/users/${userid}`, {
      withCredentials: true,
    });

    console.log(res.data);

    getData();
  };

  return (
    <div className="all-users">
      <h4>All users</h4>

      <br />

      <div>
        {users.map((user) => (
          <div className="user" key={user.userid}>
            <div className="user-name">{user.name}</div>

            <div className="delete-btn" onClick={() => deleteUser(user)}>
              Delete
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
