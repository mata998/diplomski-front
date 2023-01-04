import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { serverURL } from "../utils/utils";
import { GlobalContext } from "../context/GlobalContext";

export default function AdminRequests() {
  const { loggedIn } = useContext(GlobalContext);
  const [requestsJSX, setRequestsJSX] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      getData();
    }
  }, []);

  const getData = async () => {
    const res = await axios.get(`${serverURL()}/api/admin/requested-courses`, {
      withCredentials: true,
    });

    if (res.data.success) {
      const requests = res.data.data;
      console.log(requests);

      const reqObj = {};

      requests.forEach((request) => {
        if (!reqObj[request.courseid]) {
          reqObj[request.courseid] = {
            courseName: request.coursename,
            courseRequests: [],
          };
        }

        reqObj[request.courseid].courseRequests.push(request);
      });

      console.log(reqObj);

      renderRequests(reqObj);
    } else {
      console.log(res.data);
    }
  };

  const renderRequests = (requestsObj) => {
    const jsx = Object.values(requestsObj).map((course) => (
      <div key={course.courseName}>
        <h5 className="course-name">{course.courseName}</h5>

        {course.courseRequests.map((request) => (
          <div className="course-request" key={request.userid}>
            <div className="user-name"> {request.username}</div>
            <div className="btn-container">
              <div
                className="approve"
                onClick={(e) => approveClick(e, request)}
              >
                approve
              </div>
              <div
                className="decline"
                onClick={(e) => declineClick(e, request)}
              >
                decline
              </div>
              <div className="approved hidden">approved</div>
              <div className="declined hidden">declined</div>
            </div>
          </div>
        ))}
      </div>
    ));

    setRequestsJSX(jsx);
  };

  const approveClick = async (e, request) => {
    const res = await axios.patch(
      `${serverURL()}/api/admin/approve-course`,
      {
        userId: request.userid,
        courseId: request.courseid,
      },
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      console.log(res.data);

      const parent = e.target.parentElement;
      const children = [...parent.children];

      children.forEach((child, index) => {
        if (index !== 3) {
          child.classList.toggle("hidden");
        }
      });
    } else {
      console.log(res.data);
      alert("Error");
    }
  };

  const declineClick = async (e, request) => {
    const res = await axios.delete(
      `${serverURL()}/api/admin/usercourse?userId=${request.userid}&courseId=${
        request.courseid
      }`,
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      console.log(res.data);

      const parent = e.target.parentElement;
      const children = [...parent.children];

      children.forEach((child, index) => {
        if (index !== 2) {
          child.classList.toggle("hidden");
        }
      });
    } else {
      alert("Error");
      console.log(res.data);
    }
  };

  return (
    <div className="all-requests">
      <h4>Requests</h4>

      {requestsJSX}
    </div>
  );
}
