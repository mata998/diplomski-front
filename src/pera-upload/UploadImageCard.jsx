import styles from "./UploadImageCard.module.css";

export default function UploadImageCard({ imgSrc, removeImage }) {
  return (
    <div className={styles.imgContainer}>
      <button onClick={removeImage} className={styles.removeBtn}>
        x
      </button>
      <img src={imgSrc} alt="" className={styles.image} />
    </div>
  );
}
