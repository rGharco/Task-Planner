import SmallButton from '../small_button/small_button';
import styles from './assigned_task_entry.module.css';

function getTimeLeft(deadline) {
    if (!deadline) return "No deadline";
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff < 0) {
        return "Overdue";
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''} left`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} min left`;
    } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
    }
}

function formatDeadline(deadline) {
    if (!deadline) return "No deadline";
    return new Date(deadline).toLocaleDateString();
}

export default function AssignedTaskEntry({ title, category, description, deadline, onComplete }) {
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
                        <div className={styles.taskDeadline}> {formatDeadline(deadline)} </div>
                    </div>
                    <div className={styles.taskCategory}>{getTimeLeft(deadline)}</div>
                </div>
            </div>
            <div className={styles.horizontalContainer}>
                {description}
                <SmallButton text="Mark as Complete" onClick={onComplete}/>
            </div>
        </div>
    )
}