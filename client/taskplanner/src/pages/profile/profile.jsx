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
        // Clear user data from localStorage
        localStorage.removeItem('user');
        // Redirect to login page
        navigate('/login');
    };

    return (
        <>
            <div className={styles.header_container}>
                <PageTitle text="User Profile"/>
                <button className={styles.logout_button} onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <InterfaceBackground height="100vh">
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
                        
                        <Label text="Created Tasks"/>
                        <div className={styles.section_box_scroll}>
                            <div className={styles.small_gap_vertical_container}>
                                <CreatedTaskEntry title="Task 1" asignee="John Doe"/>
                                <CreatedTaskEntry title="Task 2" asignee="Jane Doe"/>
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