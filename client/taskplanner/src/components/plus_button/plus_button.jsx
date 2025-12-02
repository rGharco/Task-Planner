import styles from './plus_button.module.css'
import { FaPlusCircle } from "react-icons/fa";

export default function PlusButton( {href} ) {
    return (
        <a href={href} className={styles.buttonStyle}>
            <FaPlusCircle/>
        </a>
    )
}