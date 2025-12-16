import { FaGear } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import Logo from '../../assets/Logo.png';
import styles from './taskbar.module.css';
import { NavLink } from "react-router-dom";

export default function Taskbar() {
    return (
        <div className={styles.taskbar}>
            <img src={Logo} alt="Logo"></img>
            <NavLink to="/dashboard" className={styles.link}>Dashboard</NavLink>
            <NavLink to="/assign-task" className={styles.link}>Assign Task</NavLink>
            <NavLink to="/history" className={styles.link}>History</NavLink>
            <NavLink to="/profile" className={styles.icon}><FaUser/></NavLink>
            <NavLink to="/settings" className={styles.icon}><FaGear/></NavLink>
        </div>
    )
}