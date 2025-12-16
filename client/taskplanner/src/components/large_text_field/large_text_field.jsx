import styles from './large_text_field.module.css';

export default function LargeTextField( {text, value, onChange} ) {
    return (
        <div className={styles.container_style}>
            <div className={styles.font_style}>{text}</div>
            <textarea className={styles.input_style} value={value} onChange={onChange}/>
        </div>
    )
}