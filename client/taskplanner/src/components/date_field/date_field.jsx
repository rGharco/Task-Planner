import styles from './date_field.module.css';

export default function DateField( {text, value, onChange} ) {
    return (
        <div className={styles.container_style}>
            <div className={styles.font_style}>{text}</div>
            <input type="date" className={styles.input_style} value={value} onChange={onChange}/>
        </div>
    )
}