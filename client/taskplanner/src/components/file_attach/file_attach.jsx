import styles from './file_attach.module.css';

export default function FileAttach( {text} ) {
    return (
        <div className={styles.container}>
            <label htmlFor="file-input"> {text} </label>
            <input id="file-input" type="file" />
        </div>
    )
}