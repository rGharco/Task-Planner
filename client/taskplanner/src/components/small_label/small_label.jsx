import styles from './small_label.module.css';

export default function SmallLabel({text}) {
    return (
        <div className={styles.label_style}>{text}</div>
    )
}