import { useNavigate } from 'react-router-dom';
import InterfaceBackground from '../../components/interface_background/interface_background';
import styles from './profile.module.css';
import PageTitle from '../../components/page_title/page_title';
import Label from '../../components/label/label';
import InfoLine from '../../components/info_line/info_line';
import CreatedTaskEntry from '../../components/created_task_entry/created_task_entry';
import AssignedTaskEntry from '../../components/assigned_task_entry/assigned_task_entry';

export default function ProfilePage() {
    const navigate = useNavigate();
    
    // Get logged in user data
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Example tasks - later these will come from API
    const createdTasks = [
        { id: 1, title: "Task 1", assignee: "John Doe", deadline: "2025-01-15", description: "First task description" },
        { id: 2, title: "Task 2", assignee: "Jane Doe", deadline: "2025-01-20", description: "Second task description" }
    ];

    const handleModifyTask = (task) => {
        navigate('/assign-task', { state: { editTask: task } });
    };

    const handleDeleteTask = (taskId) => {
        console.log("Delete task:", taskId);
        // TODO: Call API to delete task
    };

    return (
        <>
            <div className={styles.header_container}>
                <PageTitle text="User Profile"/>
                <button className={styles.logout_button} onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <InterfaceBackground>
                <div className={styles.horizontal_container}>
                    <div className={styles.left_container}>
                        <Label text="User Information"/>
                        <div className={styles.section_box}>
                            <div className={styles.small_gap_vertical_container}>
                                <InfoLine heading="User:" info={userData.name || "User's Name"}/>
                                <InfoLine heading="User ID:" info={userData.id || "User's ID"}/>
                                <InfoLine heading="Email:" info={userData.email || "User's Email"}/>
                                <InfoLine heading="Birth Date:" info={userData.birthDate || "Not provided"}/>
                            </div>
                        </div>
                        <Label text="Created Tasks"/>
                        <div className={styles.section_box_scroll}>
                            <div className={styles.small_gap_vertical_container}>
                                {createdTasks.map(task => (
                                    <CreatedTaskEntry 
                                        key={task.id}
                                        title={task.title} 
                                        asignee={task.assignee}
                                        onModify={() => handleModifyTask(task)}
                                        onDelete={() => handleDeleteTask(task.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.right_container}>
                        <Label text="Assigned Tasks"/>
                        <div className={styles.section_box_scroll}>
                            <div className={styles.small_gap_vertical_container}>
                                <AssignedTaskEntry title="Task 1" category="Example" deadline="1 Jan 2025"
                                description="Task description goes here"
                                />
                                <AssignedTaskEntry title="Task 2" category="Example" deadline="2 Jan 2025"
                                description="Task description goes here"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </InterfaceBackground>
        </>
    )
}