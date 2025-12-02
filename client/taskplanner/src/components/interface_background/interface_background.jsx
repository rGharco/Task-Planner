import styles from './interface_background.module.css'

export default function InterfaceBackground({children}) {
    return(
        <div className={styles.backgroundStyle}>
            {children}
        </div>
    )
}