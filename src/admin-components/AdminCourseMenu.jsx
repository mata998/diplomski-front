import React, { useState, useEffect } from "react";
import AdminVideoCard from "./AdminVideoCard";
import AdminFolderCard from "./AdminFolderCard";

export default function CourseMenu({
  course,
  videos,
  videoClicked,
  folderClicked,
  deleteVideoClicked,
}) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    folderClicked(course.courseid + "/" + course.name);
  }, [course]);

  useEffect(() => {
    if (videos[0]) {
      videoClicked(videos[0]);
      const foldersObj = parseInput(videos);
      console.log(foldersObj);
      setMenu(renderMenu(foldersObj));
    } else {
      setMenu([]);
    }
  }, [videos]);

  const parseInput = (videos) => {
    const splitPath = videos[0].path.split("/");

    // if first path is: "1/Java/1) Uvod"
    // selected folder should be "1/Java"
    // folderClicked(splitPath[0] + "/" + splitPath[1]);

    // if first path is: "1/Java/1) Uvod"
    // pathStart should be "1"
    const pathStart = splitPath[0];

    const parsedRes = { folderPath: pathStart };

    videos.forEach((video) => {
      const pathsArr = video.path.split("/");

      // start at 2 if we want to skip first 2 folders: "1" and "Java"
      addVideoRek(parsedRes, pathsArr, 1, video);
    });

    return parsedRes;
  };

  const addVideoRek = (obj, pathsArr, index, data) => {
    if (obj[pathsArr[index]] === undefined) {
      obj[pathsArr[index]] = {
        folderPath: obj.folderPath + "/" + pathsArr[index],
      };
    }

    if (index === pathsArr.length - 1) {
      obj[pathsArr[index]] = { data };
      return;
    }

    addVideoRek(obj[pathsArr[index]], pathsArr, index + 1, data);
  };

  const renderMenu = (obj) => {
    if (obj.data) return;
    else
      return (
        <>
          {Object.keys(obj).map((item) => {
            // skip folderPath property
            if (item === "folderPath") return <></>;

            if (obj[item].data) {
              // Video card component
              return (
                <AdminVideoCard
                  videoData={obj[item].data}
                  videoClicked={videoClicked}
                  deleteVideoClicked={deleteVideoClicked}
                />
              );
            } else {
              // Folder card component
              return (
                <AdminFolderCard
                  folderName={item}
                  folderPath={obj[item].folderPath}
                  folderClicked={folderClicked}
                  // Recursion call
                  subFolders={renderMenu(obj[item])}
                />
              );
            }
          })}
        </>
      );
  };

  return (
    <div style={{ width: "300px", textAlign: "left" }}>
      {/* {renderMenu(foldersObj)} */}
      {menu}
    </div>
  );
}
