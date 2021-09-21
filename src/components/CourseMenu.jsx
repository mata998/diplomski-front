import React, { useState, useEffect } from "react";

export default function CourseMenu({ videos, setSelectedPath }) {
  const input = [
    "klk1/1) uvod/1) video1",
    "klk1/1) uvod/2) video2",
    "klk1/2) petlje/1) for/1) videofor",
    "klk1/2) petlje/1) for/2) video2for",
    "klk1/2) petlje/2) while/1) videowhile",
    "klk1/2) petlje/3) i ovo je video",
  ];

  const [foldersObj, setFoldersObj] = useState({});

  useEffect(() => {
    setFoldersObj(parseInput(videos));
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

  const toggleContent = (e) => {
    e.target.nextSibling.classList.toggle("hidden");
  };

  const videoClicked = (data) => {
    console.log(data);
    setSelectedPath(data.path);
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
                  onClick={() => videoClicked(obj[item].data)}
                  style={{ color: "lightblue" }}
                >
                  {item}
                </div>
              );
            } else {
              // folder jsx
              return (
                <div>
                  <div onClick={toggleContent}>{item}</div>
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
