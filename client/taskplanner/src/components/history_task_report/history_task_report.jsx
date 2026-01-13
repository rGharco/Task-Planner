import styles from "./history_task_report.module.css"

export default function HistoryTaskReport({taskTitle, executant}) {
    return (
        <li className={styles.text}>
            You received report from <a className={styles.link}>{executant}</a> for task <a className={styles.link}>{taskTitle}</a>.
        </li>
    )
}