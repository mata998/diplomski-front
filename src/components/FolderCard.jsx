import { useState } from "react";
import { VscTriangleDown, VscTriangleRight } from "react-icons/vsc";

export default function AdminFolderCard({
  type,
  folderName,
  folderPath,
  folderClicked,
  subFolders,
}) {
  const [opened, setOpened] = useState(true);

  const toggleOpen = () => {
    setOpened((opened) => !opened);
  };

  return (
    <div className="folder-card">
      <div>
        {type === "admin" && opened && <VscTriangleDown onClick={toggleOpen} />}
        {type === "admin" && !opened && (
          <VscTriangleRight onClick={toggleOpen} />
        )}
        <span
          className="folder-name"
          onClick={(e) => folderClicked(e, folderPath)}
        >
          {folderName}
        </span>
      </div>

      <div className={`sub-folders ${opened ? "" : "hidden"}`}>
        {subFolders}
      </div>
    </div>
  );
}
