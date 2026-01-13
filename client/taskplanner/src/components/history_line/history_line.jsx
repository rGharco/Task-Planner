import styles from './history_line.module.css'

export default function HistoryLine({taskTitle, executant, type, date}) {
    if (type === "task_report") {
        return (
            <li className={styles.text}>
                You received report from <a className={styles.link}>{executant}</a> for task <a className={styles.link}>{taskTitle}</a>.
            </li>
        )
    }
    else if (type === "created_task") {
        return (
            <li className={styles.text}>
                You created and assigned task <a className={styles.link}>{taskTitle}</a> to <a className={styles.link}>{executant}</a>.
            </li>
        )
    }
    else if (type === "completed_task") {
        return (
            <li className={styles.text}>
                You completed task <a className={styles.link}>{taskTitle}</a>.
            </li>
        )
    }
    else if (type === "received_task") {
        return (
            <li className={styles.text}>
                You were assigned task <a className={styles.link}>{taskTitle}</a>.
            </li>
        )
    }
}
