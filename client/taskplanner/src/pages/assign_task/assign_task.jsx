import styles from './assign_task.module.css';
import DateField from '../../components/date_field/date_field';
import FileAttach from '../../components/file_attach/file_attach';
import InterfaceBackground from '../../components/interface_background/interface_background';
import Label from '../../components/label/label';
import LargeButton from '../../components/large_button/large_button';
import LargeTextField from '../../components/large_text_field/large_text_field';
import PageTitle from '../../components/page_title/page_title';
import PlusButton from '../../components/plus_button/plus_button';
import ScrollBox from '../../components/scroll_box/scroll_box';
import Taskbar from '../../components/taskbar/taskbar';
import TextField from '../../components/text_field/text_field';

export default function AssignTaskPage() {
    return (
        <div className={styles.background}>
            <Taskbar/>
            <PageTitle text="Assign Task"/>
            <InterfaceBackground>
                <div className={styles.page_container}>
                    <div className={styles.left_container}>
                        <TextField text="Task Title"/>
                        <div className={styles.input_button_container}>
                            <TextField text="Executor"/>
                            <PlusButton href=""/>
                        </div>
                        <DateField text="Deadline"/>
                        <LargeTextField text="Description"/>
                        <FileAttach text="Add File"/>
                    </div>
                    <div className={styles.right_container}>
                        <ScrollBox width="600px" height="350px">
                            <div className={styles.input_button_container}>
                                <TextField text="Add Subtask"/>
                                <PlusButton href=""/>
                            </div>
                        </ScrollBox>
                        <div className={styles.input_button_container}>
                            <Label text="Category:"/>
                            <PlusButton href=""/>
                        </div>
                        <LargeButton text="Create Task"/>
                    </div>
                </div>
            </InterfaceBackground>
        </div>
    )
}