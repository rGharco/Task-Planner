import styles from './label.module.css'

export default function Label({text}) {
    return (
        <div className={styles.label_style}>{text}</div>
    )
}