import styles from './large_button.module.css';

export default function LargeButton({text}) {
    return (
        <div className={styles.button_style}>
            {text}
        </div>
    )
}