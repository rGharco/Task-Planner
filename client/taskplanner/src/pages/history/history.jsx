import styles from './history.module.css';
import InterfaceBackground from '../../components/interface_background/interface_background'
import PageTitle from '../../components/page_title/page_title'
import ScrollBox from '../../components/scroll_box/scroll_box';
import Label from '../../components/label/label';
import HistoryTaskReport from '../../components/history_task_report/history_task_report';
import HistoryCreatedTask from '../../components/history_created_task/history_created_task';
import HistoryCompletedTask from '../../components/history_completed_task/history_completed_task';
import HistoryAssignedTask from '../../components/history_assigned_task/history_assigned_task';
import LargeButton from '../../components/large_button/large_button';

export default function HistoryPage() {
    return (
        <>
            <PageTitle text="History"/>
            <InterfaceBackground>
                <div className={styles.button}>
                    <LargeButton text="Filter History"/>
                </div>
                <ScrollBox width="auto" height="60vh">
                    <Label text="Jan 1, 2026"/>
                    <ul>
                        <HistoryTaskReport taskTitle="Financial Report" executant="John Doe"/>
                        <HistoryCompletedTask taskTitle="Task 2"/>
                    </ul>

                    <Label text="Dec 25, 2025"/>
                    <ul>
                        <HistoryCreatedTask taskTitle="Financial Report" executant="John Doe"/>
                        <HistoryAssignedTask taskTitle="Task 2"/>
                    </ul>
                </ScrollBox>
            </InterfaceBackground>
        </>
    )
}