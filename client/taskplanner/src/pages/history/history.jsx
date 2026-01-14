import styles from './history.module.css';
import InterfaceBackground from '../../components/interface_background/interface_background'
import PageTitle from '../../components/page_title/page_title'
import ScrollBox from '../../components/scroll_box/scroll_box';
import Label from '../../components/label/label';
import LargeButton from '../../components/large_button/large_button';
import HistoryLine from '../../components/history_line/history_line';
import ModalPopup from '../../components/modal_popup/modal_popup';
import { useState } from 'react';
import LabeledList from '../../components/labeled_list/labeled_list';
import DateField from '../../components/date_field/date_field';
import Dropdown from '../../components/dropdown/dropdown';
import TextField from '../../components/text_field/text_field';

export default function HistoryPage() {
    const [showModal, setShowModal] = useState(false);

    const [draftFilters, setDraftFilters] = useState({
        date: '',
        type: '',
        executant: ''
    });

    const [activeFilters, setActiveFilters] = useState({
        type: '',
        executant: '',
        date: ''
    });

    const handleApply = () => {
        setActiveFilters(draftFilters);
        setShowModal(false);
    };

    const handleCancel = () => {
        setDraftFilters(activeFilters); 
        setShowModal(false);
    };

    const handleReset = () => {
        const emptyFilters = {
            date: '',
            type: '',
            executant: ''
        };
        setDraftFilters(emptyFilters);
        setActiveFilters(emptyFilters);
    };

    const historyData = [
        { id: 1, date: "2026-01-01", taskTitle: "Financial Report", executant: "John Doe", type: "task_report" },
        { id: 2, date: "2026-01-01", taskTitle: "Task 2", executant: "User", type: "completed_task" },
        { id: 3, date: "2025-12-20", taskTitle: "Project Alpha", executant: "John Doe", type: "created_task" },
        { id: 4, date: "2025-12-20", taskTitle: "Task 2", executant: "User", type: "received_task" }
    ]

    const filteredData = historyData.filter(item => {
        const matchesType = activeFilters.type === '' || item.type === activeFilters.type;
        const matchesExec = activeFilters.executant === '' || item.executant.toLowerCase().includes(activeFilters.executant.toLowerCase());
        const matchesDate = activeFilters.date === '' || item.date === activeFilters.date;
        return matchesType && matchesExec && matchesDate;
    });

    const groupedData = filteredData.reduce((groups, item) => {
        const date = item.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {});

    const subordinates = [
        {id: 1, username: "John Doe"},
        {id: 2, username: "Jane Smith"}
    ];

    return (
        <>
            <PageTitle text="History"/>
            <InterfaceBackground>
                <div className={styles.button}>
                    <LargeButton text="Filter History" onClick={() => setShowModal(true)}/>
                    <LargeButton text="Clear Filters" onClick={handleReset}/>
                </div>
                <ScrollBox width="auto" height="60vh">
                    {/* <LabeledList label="Jan 1, 2026">
                        <HistoryLine taskTitle="Financial Report" executant="John Doe" type="task_report"/>
                        <HistoryLine taskTitle="Task 2" type="completed_task"/>
                    </LabeledList>

                    <LabeledList label="Dec 20, 2025">
                        <HistoryLine taskTitle="Financial Report" executant="John Doe" type="created_task"/>
                        <HistoryLine taskTitle="Task 2" type="received_task"/>
                    </LabeledList> */}

                    {Object.entries(groupedData).map(([date, items]) => (
                        <LabeledList key={date} label={date}>
                            {items.map(item => (
                                <HistoryLine 
                                    key={item.id} 
                                    taskTitle={item.taskTitle} 
                                    executant={item.executant} 
                                    type={item.type}
                                />
                            ))}
                        </LabeledList>
                    ))}
                </ScrollBox>
            </InterfaceBackground>
            {showModal &&
            <ModalPopup onClose={handleCancel} onApply={handleApply} width="400px" height="460px">
                <Label text="Choose filters:"/>
                <DateField text="Date:" value={draftFilters.date} onChange={(e) => setDraftFilters({...draftFilters, date: e.target.value})}/>
                <Dropdown text="Select Type:" value={draftFilters.type} onChange={(e) => setDraftFilters({...draftFilters, type: e.target.value})}>
                    <option value="">All Types</option>
                    <option value="created_task">Created Task</option>
                    <option value="task_report">Report on Created Task</option>
                    <option value="received_task">Received Task</option>
                    <option value="completed_task">Completed Task</option>
                </Dropdown>
                <Dropdown text="Select Executant:" value={draftFilters.executant} onChange={(e) => setDraftFilters({...draftFilters, executant: e.target.value})}>
                    <option value="">Any Subordinate</option>
                    {
                        subordinates.map(subordinate => (
                            <option value={subordinate.username}>{subordinate.username}</option>
                        ))
                    }
                </Dropdown>
            </ModalPopup>}
        </>
    )
}