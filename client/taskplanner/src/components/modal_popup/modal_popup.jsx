import { useRef } from 'react'
import SmallButton from '../small_button/small_button'
import styles from './modal_popup.module.css'

export default function ModalPopup({children, onClose, onApply, width, height}) {
    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    return (
        <div className={styles.modal_container} ref={modalRef} onClick={closeModal}>
            <div className={styles.modal_box} style={{ width: width || "35%", height: height || "50%" }}>
                <div className={styles.modal_content}>
                    {children}
                </div>
                <div className={styles.horizontal_flex}>
                    <SmallButton text="Cancel" onClick={onClose}/>
                    <SmallButton text="Apply" onClick={onApply}/>
                </div>
            </div>
            
        </div>
    )
}