import SmallButton from '../small_button/small_button'
import styles from './user_line.module.css'

export default function UserLine({id, username, role, manager, onClick}) {
    return (
        <div className={styles.container}>
            <div className={styles.font_style}>ID: {id}</div>
            <div className={styles.font_style}>Username: {username}</div>
            <div className={styles.font_style}>Role: {role}</div>
            <div className={styles.font_style}>Manager: {manager ? manager : "None"}</div>
            <SmallButton text="Modify" onClick={onClick}/>
        </div>
    )
}