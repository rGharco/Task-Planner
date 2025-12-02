import styles from './scroll_box.module.css';

export default function ScrollBox( {children, width, height}) {
    return(
        <div className={styles.scrollBox} style={{width, height}}>
            { children }
        </div>
    )
}