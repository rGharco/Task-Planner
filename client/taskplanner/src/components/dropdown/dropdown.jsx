import styles from './dropdown.module.css'

export default function Dropdown({children, text, value, onChange}) {
    return (
        <div className={styles.container_style}>
            <div className={styles.font_style}>{text}</div>
            <select className={styles.select_style} value={value} onChange={onChange}>
                {children}
            </select>
        </div>
    )
}