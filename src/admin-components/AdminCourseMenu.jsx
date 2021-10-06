import React, { useState, useEffect } from "react";
import AdminVideoCard from "./AdminVideoCard";
import AdminFolderCard from "./AdminFolderCard";

export default function CourseMenu({ videos, selectVideo }) {
  const [foldersObj, setFoldersObj] = useState({});

  useEffect(() => {
    if (videos[0]) {
      selectVideo(videos[0]);
      setFoldersObj(parseInput(videos));
      console.log(parseInput(videos));
    }
  }, [videos]);

  const parseInput = (videos) => {
    // if first path is: "1/Java/1) Uvod"
    // pathStart should be "1"
    const pathStart = videos[0].path.split("/")[0];

    const parsedRes = { folderPath: pathStart };

    videos.forEach((video) => {
      const pathsArr = video.path.split("/");

      // start at 2 if we want to skip first 2 folders: "1" and "Java"
      addVideoRek(parsedRes, pathsArr, 1, video);
    });

    return parsedRes;
  };

  const addVideoRek = (obj, pathsArr, index, data) => {
    if (obj[pathsArr[index]] == undefined) {
      obj[pathsArr[index]] = {
        folderPath: obj.folderPath + "/" + pathsArr[index],
      };
    }

    if (index == pathsArr.length - 1) {
      obj[pathsArr[index]] = { data };
      return;
    }

    addVideoRek(obj[pathsArr[index]], pathsArr, index + 1, data);
  };

  const folderClicked = (folderPath) => {
    console.log(folderPath);
  };

  const rednerMenu = (obj) => {
    if (obj.data) return;
    else
      return (
        <>
          {Object.keys(obj).map((item) => {
            // skip folderPath property
            if (item == "folderPath") return <></>;

            if (obj[item].data) {
              // Video card component
              return (
                <AdminVideoCard
                  videoData={obj[item].data}
                  selectVideo={selectVideo}
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
                  subFolders={rednerMenu(obj[item])}
                />
              );
            }
          })}
        </>
      );
  };

  return (
    <div style={{ width: "300px", textAlign: "left" }}>
      {rednerMenu(foldersObj)}
    </div>
  );
}
