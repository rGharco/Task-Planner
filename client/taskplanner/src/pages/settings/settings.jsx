import styles from './settings.module.css';
import InterfaceBackground from '../../components/interface_background/interface_background'
import PageTitle from '../../components/page_title/page_title'
import TextField from '../../components/text_field/text_field';
import DateField from '../../components/date_field/date_field';
import Label from '../../components/label/label';
import LargeButton from '../../components/large_button/large_button';
import ScrollBox from '../../components/scroll_box/scroll_box';
import UserLine from '../../components/user_line/user_line';
import ModalPopup from '../../components/modal_popup/modal_popup';
import { useState, useEffect } from 'react';
import Dropdown from '../../components/dropdown/dropdown';
import TextInfo from '../../components/text_info/text_info';

export default function SettingsPage() {

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    
    const isAdmin = currentUser.role === "admin";

    // Form state for user settings
    const [username, setUsername] = useState(currentUser.name || "");
    const [birthdate, setBirthdate] = useState(currentUser.birthDate || "");
    const [email, setEmail] = useState(currentUser.email || "");

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [ userList, setUserList ] = useState([]);

    // Fetch all users for admin panel
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("http://localhost:3001/api/users");
                if (response.ok) {
                    const data = await response.json();
                    setUserList(data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    const managerList = userList.filter(user => {
        const isManager = user.role === "manager";
        const isNotSelf = selectedUser ? user.id !== selectedUser.id : true;
        return isManager && isNotSelf;
    });

    const handleModalChange = (field, value) => {
        setSelectedUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleModifyClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleApply = () => {
        setUserList(prevUsers =>
            prevUsers.map(u => u.id === selectedUser.id ? selectedUser : u)
        );
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: username,
                    birthDate: birthdate,
                    email: email
                })
            });

            if (response.ok) {
                // Update localStorage with new data
                localStorage.setItem('user', JSON.stringify({
                    ...currentUser,
                    name: username,
                    birthDate: birthdate,
                    email: email
                }));
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error saving settings');
        }
    };

    return (
        <>
            <PageTitle text="Settings"/>
            <InterfaceBackground>
                <div className={styles.horizontal_container}>
                    <div className={styles.left_container}>
                        <div className={styles.inputFields}>
                            <Label text="Change User Information:"/>
                            <TextField text="Change Username:" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <DateField text="Change Birthdate:" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}/>
                            <TextField text="Change Email:" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div>
                            <LargeButton text="Save" onClick={handleSave}/>
                        </div>
                    </div>
                    {isAdmin ? (
                        <div className={styles.right_container}>
                            <Label text="Administrator Options:"/>
                            <ScrollBox width="100%" height="100%">
                                <div className={styles.userContainer}>
                                {userList.map(item => (
                                    <UserLine 
                                        key={item.id}
                                        id={item.id}
                                        username={item.name}
                                        role={item.role}
                                        manager={item.managerId}
                                        onClick={() => handleModifyClick(item)}
                                    />
                                ))}
                                </div>
                            </ScrollBox>
                        </div>
                    ) : (
                        <div className={styles.right_container}>
                            <Label text="Administrator Options:"/>
                            <div className={styles.section_box}>
                                <TextInfo text="Insufficient permission"/>
                            </div>
                        </div>
                    )}
                </div>
            </InterfaceBackground>
            {showModal && 
            <ModalPopup onClose={handleCancel} onApply={handleApply} width="25%" height="35%">
                <Dropdown text="Change Role:" value={selectedUser.role} onChange={(e) => handleModalChange('role', e.target.value)}>
                    <option value="executor">Executor</option>
                    <option value="manager">Manager</option>
                </Dropdown>
                <Dropdown text="Change Manager:" value={selectedUser.managerId} onChange={(e) => handleModalChange('managerId', e.target.value)}>
                    <option value="">None</option>
                    {
                        managerList.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))
                    }
                </Dropdown>
            </ModalPopup>}
        </>
    )
}