import { FaGear } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import Logo from '../../assets/Logo.png';
import styles from './taskbar.module.css';
import { NavLink } from "react-router-dom";
import {useState, useEffect} from 'react'

export default function Taskbar() {
    const [user, setUser] = useState({});
    useEffect(() => {
        // Luam cookie-ul din localStorage pentru a ne asigura ca executorii nu au access la assign task page
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <div className={styles.taskbar}>
            <img src={Logo} alt="Logo"></img>
            <NavLink to="/dashboard" className={styles.link}>Dashboard</NavLink>
            {user.role === "manager" && <NavLink to="/assign-task" className={styles.link}>Assign Task</NavLink>}
            <NavLink to="/history" className={styles.link}>History</NavLink>
            <NavLink to="/profile" className={styles.icon}><FaUser/></NavLink>
            <NavLink to="/settings" className={styles.icon}><FaGear/></NavLink>
        </div>
    )
}