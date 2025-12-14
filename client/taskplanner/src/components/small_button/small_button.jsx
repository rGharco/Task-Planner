import styles from './small_button.module.css';

export default function SmallButton({text}) {
    return (
    <div className={styles.button_style}>
        {text}
    </div>
    )
}