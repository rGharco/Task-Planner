import SmallButton from "../small_button/small_button";
import styles from "./created_task_entry.module.css";

export default function CreatedTaskEntry({ title, asignee, onModify, onDelete }) {
    return (
        <div className={styles.entryStyle}>
            <div className={styles.verticalContainer}>
                <div className={styles.taskTitle}> {title} </div>
                <div className={styles.taskAsignee}> {asignee} </div>
            </div>
            <div className={styles.buttonContainer}>
                <SmallButton text="Modify" onClick={onModify}/>
                <SmallButton text="Delete" onClick={onDelete}/>
            </div>
        </div>
    )
}