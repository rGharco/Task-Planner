import styles from './interface_background.module.css'

export default function InterfaceBackground({children, height}) {
    return(
        <div className={styles.backgroundStyle} style={{height: height || "auto"}}>
            {children}
        </div>
    )
}