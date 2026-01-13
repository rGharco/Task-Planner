import styles from './task_table_entry.module.css';

export default function TaskTableEntry({id, title, description, status, deadline, category}) {
    return (
        <tr>
            <td>{id}</td>
            <td>{title}</td>
            <td>{description}</td>
            <td>{status}</td>
            <td>{deadline ? new Date(deadline).toLocaleDateString() : 'No deadline'}</td>
            <td>{category}</td>
        </tr>
    )
}