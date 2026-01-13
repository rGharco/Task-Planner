import styles from "./history_assigned_task.module.css"

export default function HistoryAssignedTask({taskTitle}) {
    return (
        <li className={styles.text}>
            You were assigned task <a className={styles.link}>{taskTitle}</a>.
        </li>
    )
}