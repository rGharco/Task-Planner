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
import { useState } from 'react';
import Dropdown from '../../components/dropdown/dropdown';

export default function SettingsPage() {

    const isAdmin = true;

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [ userList, setUserList ] = useState([
        {id: 1, username: "User 1", birthdate: "2000-01-01", role: "manager", manager: "User 2"},
        {id: 2, username: "User 2", birthdate: "2000-01-01", role: "manager", manager: "User 3"},
        {id: 3, username: "User 3", birthdate: "2000-01-01", role: "manager", manager: "User 4"},
        {id: 4, username: "User 4", birthdate: "2000-01-01", role: "manager", manager: null},
        {id: 5, username: "User 5", birthdate: "2000-01-01", role: "executant", manager: "User 1"},
        {id: 6, username: "User 6", birthdate: "2000-01-01", role: "executant", manager: "User 3"}
    ]);

    const managerList = userList.filter(user => {
        const isManager = user.role === "manager";
        const isNotSelf = selectedUser ? user.id !== selectedUser.id : true;
        return isManager && isNotSelf;
    });

    const handleModalChange = (field, value) => {
        setSelectedUser(prev => ({
            ...prev,
            [field]: value
        })
    );
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

    return (
        <>
            <PageTitle text="Settings"/>
            <InterfaceBackground height="75vh">
                <div className={styles.horizontal_container}>
                    <div className={styles.left_container}>
                        <div className={styles.inputFields}>
                            <Label text="Change User Information:"/>
                            <TextField text="Change Username:" value="Current Username"/>
                            <DateField text="Change Birthdate:" value="2000-01-01"/>
                            <TextField text="Change Email" value="Current Email"/>
                        </div>
                        <div>
                            <LargeButton text="Save"/>
                        </div>
                    </div>
                    {isAdmin &&
                    <div className={styles.right_container}>
                        <Label text="Administrator Options:"/>
                        <ScrollBox width="100%" height="100%">
                            <div className={styles.userContainer}>
                            {userList.map(item => (
                                <UserLine 
                                    key={item.id}
                                    id={item.id}
                                    username={item.username}
                                    role={item.role}
                                    manager={item.manager}
                                    onClick={() => handleModifyClick(item)}
                                />
                            ))}
                            </div>
                        </ScrollBox>
                    </div>
                    }
                </div>
            </InterfaceBackground>
            {showModal && 
            <ModalPopup onClose={handleCancel} onApply={handleApply} width="400px" height="300px">
                <Dropdown text="Change Role:" value={selectedUser.role} onChange={(e) => handleModalChange('role', e.target.value)}>
                    <option value="executant">Executant</option>
                    <option value="manager">Manager</option>
                </Dropdown>
                <Dropdown text="Change Manager:" value={selectedUser.manager} onChange={(e) => handleModalChange('manager', e.target.value)}>
                    <option value={null}>None</option>
                    {
                        managerList.map(item => (
                            <option key={item.id} value={item.username}>{item.username}</option>
                        ))
                    }
                </Dropdown>
            </ModalPopup>}
        </>
    )
}