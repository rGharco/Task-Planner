import SmallButton from "../small_button/small_button";
import styles from "./created_task_entry.module.css";

export default function CreatedTaskEntry({ title, asignee, status, onModify, onDelete, onClose }) {
    const statusClasses = {
        PENDING: styles.pendingStyle,
        OPEN: styles.openStyle,
        COMPLETE: styles.completeStyle
    };

    const statusStyle = statusClasses[status] || "";

    return (
        <div className={styles.entryStyle}>
            <div className={styles.verticalContainer}>
                <div className={styles.taskTitle}> {title} </div>
                <div className={styles.taskAsignee}> {asignee} </div>
            </div>
            <div className={styles.horizontalContainer}>
                <div className={styles.statusTitle}>Status:</div>
                <div className={`${styles.statusText} ${statusStyle}`}>{status}</div>
            </div>
            <div className={styles.buttonContainer}>
                <SmallButton text="Modify" onClick={onModify}/>
                <SmallButton text="Close" onClick={onClose}/>
                <SmallButton text="Delete" onClick={onDelete}/>
            </div>
        </div>
    )
}