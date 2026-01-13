import styles from "./history_completed_task.module.css"

export default function HistoryCompletedTask({taskTitle}) {
    return (
        <li className={styles.text}>
            You completed task <a className={styles.link}>{taskTitle}</a>.
        </li>
    )
}