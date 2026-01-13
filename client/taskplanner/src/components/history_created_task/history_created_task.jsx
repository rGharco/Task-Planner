import styles from "./history_created_task.module.css"

export default function HistoryCreatedTask({taskTitle, executant}) {
    return (
        <li className={styles.text}>
            You created and assigned task <a className={styles.link}>{taskTitle}</a> to <a className={styles.link}>{executant}</a>.
        </li>
    )
}