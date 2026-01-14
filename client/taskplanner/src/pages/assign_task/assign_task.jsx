import styles from './assign_task.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import DateField from '../../components/date_field/date_field';
import FileAttach from '../../components/file_attach/file_attach';
import InterfaceBackground from '../../components/interface_background/interface_background';
import Label from '../../components/label/label';
import LargeButton from '../../components/large_button/large_button';
import LargeTextField from '../../components/large_text_field/large_text_field';
import PageTitle from '../../components/page_title/page_title';
import PlusButton from '../../components/plus_button/plus_button';
import ScrollBox from '../../components/scroll_box/scroll_box';
import TextField from '../../components/text_field/text_field';
import { useState, useEffect } from "react";
import Dropdown from '../../components/dropdown/dropdown';

export default function AssignTaskPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const editTask = location.state?.editTask;
    const isEditMode = !!editTask;

    const [taskTitle, setTaskTitle] = useState("");
    const [executor, setExecutor] = useState("");
    const [asigneeId, setAsigneeId] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState([]);

    // Fetch users for dropdown
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("http://localhost:3001/api/users");
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();
    }, []);

    // Pre-fill form if editing
    useEffect(() => {
        if (editTask) {
            setTaskTitle(editTask.title || "");
            setExecutor(editTask.executor || "");
            setAsigneeId(editTask.asigneeId || "");
            setDeadline(editTask.deadline || "");
            setDescription(editTask.description || "");
        }
    }, [editTask]);

    async function handleCreateTask() {
        const user = JSON.parse(localStorage.getItem('user'));
        
        const taskData = {
            title: taskTitle,
            executor: executor,
            asigneeId: asigneeId || null,
            deadline: deadline,
            description: description,
            status: isEditMode ? (editTask.status || "OPEN") : "OPEN",
            category: isEditMode ? (editTask.category || null) : null,
            creatorId: user?.id
        };

        try {
            let response;
            
            if (isEditMode) {
                response = await fetch(`http://localhost:3001/api/tasks/modify/${editTask.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(taskData),
                });
            } else {
                response = await fetch("http://localhost:3001/api/tasks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(taskData),
                });
            }

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log(isEditMode ? "Task updated:" : "Task created:", data);
            
            setTaskTitle("");
            setExecutor("");
            setAsigneeId("");
            setDeadline("");
            setDescription("");
            
            navigate('/profile');
        } catch (err) {
            console.error("Error saving task:", err);
        }
    }

    const handleExecutorChange = (e) => {
        const selectedId = e.target.value;
        setAsigneeId(selectedId);
        
        // Also set executor name for display purposes
        const selectedUser = users.find(u => u.id.toString() === selectedId);
        setExecutor(selectedUser ? selectedUser.name : "");
    };

    return (
        <>
            <PageTitle text={isEditMode ? "Edit Task" : "Assign Task"}/>
            <InterfaceBackground>
                <div className={styles.page_container}>
                    <div className={styles.left_container}>
                        <TextField text="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}/>
                        <Dropdown text="Executor" value={asigneeId} onChange={handleExecutorChange}>
                            <option value="">Select executor...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </Dropdown>
                        <DateField text="Deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
                        <LargeTextField text="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                        <FileAttach text="Add File"/>
                    </div>
                    <div className={styles.right_container}>
                        <ScrollBox width="600px" height="350px">
                            <div className={styles.input_button_container}>
                                <TextField text="Add Subtask"/>
                                <PlusButton onClick={() => console.log("Add subtask")}/>
                            </div>
                        </ScrollBox>
                        <div className={styles.input_button_container}>
                            <Label text="Category:"/>
                            <PlusButton onClick={() => console.log("Add category")}/>
                        </div>
                        <LargeButton text={isEditMode ? "Update Task" : "Create Task"} onClick={handleCreateTask}/>
                    </div>
                </div>
            </InterfaceBackground>
        </>
    )
}