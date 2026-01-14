import styles from './history.module.css';
import InterfaceBackground from '../../components/interface_background/interface_background'
import PageTitle from '../../components/page_title/page_title'
import ScrollBox from '../../components/scroll_box/scroll_box';
import Label from '../../components/label/label';
import LargeButton from '../../components/large_button/large_button';
import HistoryLine from '../../components/history_line/history_line';
import ModalPopup from '../../components/modal_popup/modal_popup';
import { useState, useEffect } from 'react';
import LabeledList from '../../components/labeled_list/labeled_list';
import DateField from '../../components/date_field/date_field';
import Dropdown from '../../components/dropdown/dropdown';
import TextField from '../../components/text_field/text_field';

export default function HistoryPage() {
    const [showModal, setShowModal] = useState(false);
    const [historyData, setHistoryData] = useState([]); // stocam aici taskuri din baza de date luate prin API
    const [subordinates, setSubordinates] = useState([]); 

    // Cand utilizatorul deschide meniul de filtre si le introduce, pana nu da click pe apply nu se modifica in activeFilters
    const [draftFilters, setDraftFilters] = useState({
        date: '',
        type: '',
        executant: ''
    });

    // Cand utilizatorul da click pe Modulepop-up apply atunci drafturile devin active
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

    // Luam cookie-ul din localStorage pentru a permite userului sa isi ia propriile taskuri
    const userCookie = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        async function loadHistory() {
            try {
                let targetUserId = userCookie.id;

                if (activeFilters.executant) {
                    const selectedSub = subordinates.find(s => s.name === activeFilters.executant);
                    if (selectedSub) {
                        targetUserId = selectedSub.id; 
                    }
                }

                const response = await fetch(`http://localhost:3001/api/tasks/userHistory?userId=${targetUserId}`); 
                if (!response.ok) throw new Error(`Server error: ${response.status}`);
                const tasks = await response.json();
                
                setHistoryData(tasks);
            }
            catch (error) {
                console.error(`Failed to get task history. Error: ${error}`);
            }
        }   

        loadHistory();

    }, [activeFilters.executant, userCookie.id]);

    // In maparea datelor, determinam cine este ownerul vizualizarii curente
    const getCurrentViewedId = () => {
        if (activeFilters.executant) {
            const selectedSub = subordinates.find(s => s.name === activeFilters.executant);
            return selectedSub ? selectedSub.id : userCookie.id;
        }
        return userCookie.id;
    };

    // Pentru ca maparea e complexa in functie fie de cine a facut taskul fie de statusul lui folosim functia asta pentru compatbilitiate
    const mapStatusToType = (task) => {
        const viewedUserId = getCurrentViewedId();

        if (task.status === "CLOSED") return "completed_task";
        
        if (viewedUserId === task.creatorId) return "created_task";
        
        // Dacă cel la care ne uităm este cel care a primit task-ul (executorul)
        return "received_task";
    };

    const filteredData = historyData.filter(task => {
        const matchesType = activeFilters.type === '' || mapStatusToType(task) === activeFilters.type;
        const matchesExec = activeFilters.executant === '' || (task.executor || '').toLowerCase().includes(activeFilters.executant.toLowerCase());
        const matchesDate = activeFilters.date === '' || (task.deadline && new Date(task.deadline).toISOString().split('T')[0] === activeFilters.date);
        return matchesType && matchesExec && matchesDate;
    });

    useEffect(() => {
        if (userCookie.role === "manager") {
            async function loadSubordinates() {
                try {
                    const response = await fetch(`http://localhost:3001/api/users/getManagerExecutors?managerId=${userCookie.id}`); 
                    if (!response.ok) throw new Error("Failed to fetch subordinates");
                    const data = await response.json();
                    console.log(data);

                    setSubordinates(data);
                } catch (error) {
                    console.error("Error loading subordinates:", error);
                }
            }
            loadSubordinates();
        }
    }, [userCookie.role, userCookie.id]);

    return (
        <>
            <PageTitle text="History"/>
            <InterfaceBackground height="75vh">
                <div className={styles.button}>
                    <LargeButton text="Filter History" onClick={() => setShowModal(true)}/>
                    <LargeButton text="Clear Filters" onClick={handleReset}/>
                </div>
                <ScrollBox width="auto" height="60vh">
                    {filteredData.map(task => (
                        <LabeledList key={task.id} label={task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Date'}>
                            <HistoryLine
                                key={task.id}
                                taskTitle={task.title}
                                executant={task.executor || 'Unknown'}
                                type={mapStatusToType(task)}
                                date={task.deadline}
                            />
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
                {userCookie.role ==="manager" && <Dropdown text="Select Executant:" value={draftFilters.executant} onChange={(e) => setDraftFilters({...draftFilters, executant: e.target.value})}>
                    <option value="">Any Subordinate</option>
                    {
                        subordinates.map(subordinate => (
                            <option value={subordinate.name}>{subordinate.name}</option>
                        ))
                    }
                </Dropdown>}
            </ModalPopup>}
        </>
    )
}