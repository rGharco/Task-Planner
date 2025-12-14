import styles from './text_info.module.css';

export default function TextInfo({text}) {
    return (
        <div className={styles.text_style}>{text}</div>
    )
}