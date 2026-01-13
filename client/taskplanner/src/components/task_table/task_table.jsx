import TaskTableEntry from '../task_table_entry/task_table_entry';
import styles from './task_table.module.css';

export default function TaskTable({children}) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.idCol}>ID</th>
                        <th className={styles.titleCol}>Title</th>
                        <th className={styles.descCol}>Description</th>
                        <th className={styles.statusCol}>Status</th>
                        <th className={styles.deadlineCol}>Deadline</th>
                        <th className={styles.categoryCol}>Category</th>    
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {/* Generam table entry dinamic in dashboard bazat pe criteriu de timp */}
                    {children}
                </tbody>
            </table>
        </div>
    )
}