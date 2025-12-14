import styles from './assigned_task_entry.module.css';

export default function AssignedTaskEntry( {title, category, description, deadline} ) {
    return (
        <div className={styles.entryStyle}>
            <div className={styles.horizontalContainer}>
                <div className={styles.verticalContainer}>
                    <div className={styles.taskTitle}> {title} </div>
                    <div className={styles.lineContainer}>
                        <div className={styles.taskCategory}>Categories:</div>
                        <div className={styles.taskCategory}> {category} </div>
                    </div>
                </div>
                <div className={styles.verticalContainer}>
                    <div className={styles.lineContainer}>
                        <div className={styles.taskDeadline}>Deadline:</div>
                        <div className={styles.taskDeadline}> {deadline} </div>
                    </div>
                    <div className={styles.taskCategory}>X days, Y weeks, Z hours left</div>
                </div>
            </div>
            <div>
                {description}
            </div>
        </div>
    )
}