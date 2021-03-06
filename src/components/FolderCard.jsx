import { useState, useEffect, useRef } from "react";
import { VscTriangleDown, VscTriangleRight } from "react-icons/vsc";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { serverURL } from "../utils/utils";

export default function FolderCard({
  type,
  isOpened = false,
  folderName,
  folderPath,
  folderClicked,
  deleteFolderClicked,
  subFolders,
}) {
  const [opened, setOpened] = useState(isOpened);
  const [addFolder, setAddFolder] = useState(false);
  const [newFolders, setNewFolders] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [addFolder]);

  useEffect(() => {
    setNewFolders([]);
  }, [subFolders]);

  const toggleOpen = () => {
    setOpened((opened) => !opened);
  };

  const newFolderClick = () => {
    setOpened(true);
    setAddFolder(true);
  };

  const inputKeyDown = (e) => {
    if (e.key === "Escape") {
      setInputValue("");
      setAddFolder(false);
    }

    if (e.key === "Enter") {
      const folder = (
        <FolderCard
          key={`${folderPath}/${inputValue}`}
          type={type}
          folderName={inputValue}
          folderPath={`${folderPath}/${inputValue}`}
          folderClicked={folderClicked}
          deleteFolderClicked={deleteFolderClicked}
          // Recursion call
          subFolders={<></>}
        />
      );

      setNewFolders((oldFolders) => [...oldFolders, folder]);

      folderClicked(`${folderPath}/${inputValue}`);

      setInputValue("");
      setAddFolder(false);
    }
  };

  return (
    <div className="folder-card">
      <div className="name-box">
        <div>
          {type === "admin" && opened && (
            // Triangle down
            <VscTriangleDown onClick={toggleOpen} />
          )}
          {type === "admin" && !opened && (
            // Triangle right
            <VscTriangleRight onClick={toggleOpen} />
          )}
          <span
            className="folder-name"
            onClick={(e) => folderClicked(folderPath, toggleOpen)}
          >
            {folderName}
          </span>
        </div>
        {type === "admin" && (
          <div className="options">
            {/* <span>+</span> */}
            <FaPlus onClick={newFolderClick} />
            <FaTrash
              onClick={() => deleteFolderClicked(folderName, folderPath)}
            />
          </div>
        )}
      </div>

      <div className={`sub-folders ${opened ? "" : "hidden"}`}>
        {subFolders}

        {newFolders}

        {addFolder && (
          <>
            <input
              type="text"
              className="new-folder-input"
              placeholder="Folder name"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={inputKeyDown}
            />
          </>
        )}
      </div>
    </div>
  );
}
