import styles from './page_title.module.css'

export default function PageTitle({text}) {
    return (
        <div className={styles.fontStyle}>{text}</div>
    )
}