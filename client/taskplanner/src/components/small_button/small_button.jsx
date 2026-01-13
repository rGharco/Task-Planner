import styles from './small_button.module.css';

export default function SmallButton({text, onClick}) {
    return (
    <div className={styles.button_style} onClick={onClick}>
        {text}
    </div>
    )
}