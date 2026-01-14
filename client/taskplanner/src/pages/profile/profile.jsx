import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InterfaceBackground from '../../components/interface_background/interface_background';
import styles from './profile.module.css';
import PageTitle from '../../components/page_title/page_title';
import Label from '../../components/label/label';
import InfoLine from '../../components/info_line/info_line';
import CreatedTaskEntry from '../../components/created_task_entry/created_task_entry';
import AssignedTaskEntry from '../../components/assigned_task_entry/assigned_task_entry';
import TextInfo from '../../components/text_info/text_info';

export default function ProfilePage() {
const navigate = useNavigate();

// Get logged in user data
const userData = JSON.parse(localStorage.getItem('user')) || {};

const isExecutor = userData.role === "executor" ? true : false;

const [createdTasks, setCreatedTasks] = useState([]);
const [assignedTasks, setAssignedTasks] = useState([]);
const [loading, setLoading] = useState(true);

// Fetch tasks from API
useEffect(() => {
    async function fetchTasks() {
        try {
            // Fetch tasks created by this user
            const createdRes = await fetch(`http://localhost:3001/api/tasks/created/${userData.id}`);
            if (createdRes.ok) {
                let createdData = await createdRes.json();
                
                // Daca taskurile sunt deja completate numai le afisam
                createdData = createdData.filter(task => task.status !== "ENDED");

                setCreatedTasks(createdData);
            }
            
            // Fetch tasks assigned to this user
            const assignedRes = await fetch(`http://localhost:3001/api/tasks/assigned/${userData.id}`);
            if (assignedRes.ok) {
                let assignedData = await assignedRes.json();

                // Daca taskurile sunt deja completate numai le afisam
                assignedData = assignedData.filter(task => task.status !== "COMPLETED");

                setAssignedTasks(assignedData);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }

    if (userData.id) {
        fetchTasks();
    } else {
        setLoading(false);
    }
}, [userData.id]);

const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
};

const handleModifyTask = (task) => {
    navigate('/assign-task', { state: { editTask: task } });
};

const handleDeleteTask = async (taskId) => {
    try {
        const response = await fetch(`http://localhost:3001/api/tasks/delete/${taskId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            // Remove from local state
            setCreatedTasks(createdTasks.filter(task => task.id !== taskId));
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

async function handleCompleteTask(task) {
    try {
        const response = await fetch(
            `http://localhost:3001/api/tasks/completeTask/${task.id}`,
            {
                method: 'PUT'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        setAssignedTasks(prev =>
            prev.filter(t => t.id !== task.id)
        );
    } catch (error) {
        console.error(error);
    }
}

async function handleCloseTask(task) {
    try {
        const response = await fetch(
            `http://localhost:3001/api/tasks/endTask/${task.id}`,
            {
                method: 'PUT'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        setCreatedTasks(prevTasks =>
            prevTasks.filter(t => t.id !== task.id)
        );
    }
    catch (error) {
        console.error(
            `An error occurred marking a task as complete: ${error}`
        );
    }
}

return (
    <>
        <div className={styles.header_container}>
            <PageTitle text="User Profile"/>
            <button className={styles.logout_button} onClick={handleLogout}>
                Logout
            </button>
        </div>
        <InterfaceBackground height="75vh">
            <div className={styles.horizontal_container}>
                <div className={styles.left_container}>
                    <Label text="User Information"/>
                    <div className={styles.section_box}>
                        <div className={styles.small_gap_vertical_container}>
                            <InfoLine heading="User:" info={userData.name || "User's Name"}/>
                            <InfoLine heading="User ID:" info={userData.id || "User's ID"}/>
                            <InfoLine heading="Email:" info={userData.email || "User's Email"}/>
                            <InfoLine heading="Role:" info={userData.role || "User's Role"}/>
                            <InfoLine heading="Birth Date:" info={userData.birthDate || "Not provided"}/>
                        </div>
                    </div>
                    {!isExecutor &&
                    <div>
                        <Label text="Created Tasks"/>
                        <div className={styles.section_box_scroll}>
                            <div className={styles.small_gap_vertical_container}>
                                {loading ? (
                                    <TextInfo text="Loading..."/>
                                ) : createdTasks.length > 0 ? (
                                    createdTasks.map(task => (
                                        <CreatedTaskEntry
                                            key={task.id}
                                            title={task.title}
                                            asignee={task.executor || "Unassigned"}
                                            status={task.status}
                                            onModify={() => handleModifyTask(task)}
                                            onDelete={() => handleDeleteTask(task.id)}
                                            onClose={() => handleCloseTask(task)}
                                        />
                                    ))
                                ) : (
                                    <TextInfo text="No created tasks"/>
                                )}
                            </div>
                        </div>
                    </div>
                    }
                </div>
                <div className={styles.right_container}>
                    <Label text="Assigned Tasks"/>
                    <div className={styles.section_box_scroll}>
                        <div className={styles.small_gap_vertical_container}>
                            {loading ? (
                                <p>Loading...</p>
                            ) : assignedTasks.length > 0 ? (
                                assignedTasks.map(task => (
                                    <AssignedTaskEntry
                                        key={task.id}
                                        title={task.title}
                                        category={task.category || "No category"}
                                        deadline={task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                                        description={task.description || "No description"}
                                        onComplete={() => {handleCompleteTask(task)}}
                                    />
                                ))
                            ) : (
                                <TextInfo text="No assigned tasks"/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </InterfaceBackground>
    </>
)
}