import styles from './large_text_field.module.css';

export default function LargeTextField( {text} ) {
    return (
        <div className={styles.container_style}>
            <div className={styles.font_style}>{text}</div>
            <textarea className={styles.input_style}/>
        </div>
    )
}