import React, { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import FolderCard from "./FolderCard";

export default function CourseMenu({
  type,
  course,
  videos,
  videoClicked,
  folderClicked,
  deleteVideoClicked,
  deleteFolderClicked,
}) {
  const [menu, setMenu] = useState([]);
  const depth = 2;

  useEffect(() => {
    folderClicked(course.courseid + "/" + course.name);
  }, [course]);

  useEffect(() => {
    if (videos[0]) {
      videoClicked(videos[0]);
      const foldersObj = parseInput(videos);
      console.log(foldersObj);
      const renderedMenu = renderMenu(foldersObj);
      // console.log(renderedMenu);
      setMenu(renderedMenu);
    } else {
      setMenu([]);
    }
  }, [videos]);

  const parseInput = (videos) => {
    const splitPath = videos[0].path.split("/");

    // if first path is: "1/Java/1) Uvod"
    // depth = 1
    // pathStart should be "1"
    // depth = 2
    // pathstart should be "1/Java"
    let pathStart = "";
    for (let i = 0; i < depth; i++) {
      pathStart += `/${splitPath[i]}`;
    }
    // remove first /
    pathStart = pathStart.slice(1);

    const parsedRes = { folderPath: pathStart };

    videos.forEach((video) => {
      const pathsArr = video.path.split("/");

      // depth is 2 if we want to skip first 2 folders: "1" and "Java"
      addVideoRek(parsedRes, pathsArr, depth, video);
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
            if (item === "folderPath")
              return <React.Fragment key={Math.random()} />;

            if (obj[item].data) {
              // Video card component
              return (
                <VideoCard
                  key={obj[item].data.videoid}
                  type={type}
                  videoData={obj[item].data}
                  videoClicked={videoClicked}
                  deleteVideoClicked={deleteVideoClicked}
                />
              );
            } else {
              // Folder card component
              return (
                <FolderCard
                  key={obj[item].folderPath}
                  type={type}
                  folderName={item}
                  folderPath={obj[item].folderPath}
                  folderClicked={folderClicked}
                  deleteFolderClicked={deleteFolderClicked}
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
    <div className="course-menu">
      <h3
        onClick={() => folderClicked(course.courseid + "/" + course.name)}
        className="course-name"
      >
        {course.name}
      </h3>

      <div className="scroll">{menu}</div>
    </div>
  );
}
