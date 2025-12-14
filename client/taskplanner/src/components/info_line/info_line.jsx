import SmallLabel from '../small_label/small_label';
import TextInfo from '../text_info/text_info';
import styles from './info_line.module.css';

export default function InfoLine( {heading, info} ) {
    return(
        <div className={styles.container}>
            <SmallLabel text={heading}/>
            <TextInfo text={info}/>
        </div>
    )
}