import styles from './text_field.module.css'

export default function TextField({text}) {
    return (
        <div className={styles.container_style}>
            <div className={styles.font_style}>{text}</div>
            <input type="text" className={styles.input_style}/>
        </div>
    )
}