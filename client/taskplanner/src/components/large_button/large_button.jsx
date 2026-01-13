import styles from './large_button.module.css';

export default function LargeButton({text, onClick}) {
    return (
        <div className={styles.button_style} onClick={onClick}>
            {text}
        </div>
    )
}