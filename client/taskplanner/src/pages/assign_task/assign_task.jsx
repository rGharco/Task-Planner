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

export default function AssignTaskPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Check if we're editing an existing task
    const editTask = location.state?.editTask;
    const isEditMode = !!editTask;

    const [taskTitle, setTaskTitle] = useState("");
    const [executor, setExecutor] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");

    // Pre-fill form if editing
    useEffect(() => {
        if (editTask) {
            setTaskTitle(editTask.title || "");
            setExecutor(editTask.assignee || "");
            setDeadline(editTask.deadline || "");
            setDescription(editTask.description || "");
        }
    }, [editTask]);

    async function handleCreateTask() {
        const taskData = {
            title: taskTitle,
            executor: executor,
            deadline: deadline,
            description: description,
            status: isEditMode ? (editTask.status || "OPEN") : "OPEN",
            category: isEditMode ? (editTask.category || null) : null
        };

        try {
            let response;
            
            if (isEditMode) {
                // Update existing task
                response = await fetch(`http://localhost:3001/api/tasks/modify/${editTask.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(taskData),
                });
            } else {
                // Create new task
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
            
            // Clear form and navigate back to profile
            setTaskTitle("");
            setExecutor("");
            setDeadline("");
            setDescription("");
            
            if (isEditMode) {
                navigate('/profile');
            }
        } catch (err) {
            console.error("Error saving task:", err);
        }
    }

    return (
        <>
            <PageTitle text={isEditMode ? "Edit Task" : "Assign Task"}/>
            <InterfaceBackground>
                <div className={styles.page_container}>
                    <div className={styles.left_container}>
                        <TextField text="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}/>
                        <div className={styles.input_button_container}>
                            <TextField text="Executor" value={executor} onChange={(e) => setExecutor(e.target.value)}/>
                            <PlusButton onClick={() => console.log("Add executor")}/>
                        </div>
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