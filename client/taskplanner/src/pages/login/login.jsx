import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import InterfaceBackground from '../../components/interface_background/interface_background';
import PageTitle from '../../components/page_title/page_title';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        setError('');

        // Validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${api}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            // Success - store user data and redirect to profile
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/profile');
        } catch (err) {
            setError('Failed to connect to server');
            setLoading(false);
        }
    };

    return (
        <div className={styles.background}>
            <PageTitle text="Login"/>
            <InterfaceBackground>
                <div className={styles.form_container}>
                    {error && <div className={styles.error_message}>{error}</div>}
                    
                    <div className={styles.input_container}>
                        <label className={styles.label}>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className={styles.input_style} 
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className={styles.input_style} 
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.button_container}>
                        <button 
                            className={styles.button_style} 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    <div className={styles.link_container}>
                        <span className={styles.link_text}>Don't have an account? </span>
                        <Link to="/register" className={styles.link}>Register here</Link>
                    </div>
                </div>
            </InterfaceBackground>
        </div>
    )
}