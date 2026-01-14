import styles from './plus_button.module.css'
import { FaPlusCircle } from "react-icons/fa";

export default function PlusButton({ onClick }) {
    return (
        <div onClick={onClick} className={styles.buttonStyle}>
            <FaPlusCircle/>
        </div>
    )
}