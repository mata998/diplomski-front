import React, { useState, useEffect } from "react";

export default function CourseMenu({ videos, selectVideo }) {
  const [foldersObj, setFoldersObj] = useState({});

  useEffect(() => {
    if (videos[0]) {
      selectVideo(videos[0]);
    }
    setFoldersObj(parseInput(videos));
    console.log(parseInput(videos));
  }, [videos]);

  const parseInput = (videos) => {
    const parsedRes = {};

    videos.forEach((video) => {
      const pathsArr = video.path.split("/");

      // start at 2 if we want to skip first 2 folder "1" "Java"
      addVideoRek(parsedRes, pathsArr, 2, video);
    });

    return parsedRes;
  };

  const addVideoRek = (obj, pathsArr, index, data) => {
    if (obj[pathsArr[index]] == undefined) {
      obj[pathsArr[index]] = {};
    }

    if (index == pathsArr.length - 1) {
      obj[pathsArr[index]] = { data };
      return;
    }

    addVideoRek(obj[pathsArr[index]], pathsArr, index + 1, data);
  };

  const folderClicked = (e) => {
    e.target.nextSibling.classList.toggle("hidden");
  };

  const rednerMenu = (obj) => {
    if (obj.data) return;
    else
      return (
        <>
          {Object.keys(obj).map((item) => {
            if (obj[item].data) {
              // video jsx
              return (
                <div
                  onClick={() => selectVideo(obj[item].data)}
                  style={{ color: "lightblue" }}
                >
                  {item}
                </div>
              );
            } else {
              // folder jsx
              return (
                <div>
                  <div onClick={folderClicked}>{item}</div>
                  <div style={{ paddingLeft: "20px" }}>
                    {rednerMenu(obj[item])}
                  </div>
                </div>
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
