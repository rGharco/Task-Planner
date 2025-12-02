import { FaGear } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import Logo from '../../assets/Logo.png';
import styles from './taskbar.module.css';

export default function Taskbar() {
    return (
        <div className={styles.taskbar}>
            <img src={Logo} alt="Logo"></img>
            <a href="">Dashboard</a>
            <a href="">Assign Task</a>
            <a href="">History</a>
            <a href="" className={styles.icon}><FaUser/></a>
            <a href="" className={styles.icon}><FaGear/></a>
        </div>
    )
}