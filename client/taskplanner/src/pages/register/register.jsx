import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './register.module.css';
import InterfaceBackground from '../../components/interface_background/interface_background';
import PageTitle from '../../components/page_title/page_title';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        password: '',
        confirmPassword: ''
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
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://task-planner-api-bmko.onrender.com/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    birthDate: formData.birthDate || null,
                    role: 'executor'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }

            // Success - redirect to login
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError('Failed to connect to server');
            setLoading(false);
        }
    };

    return (
        <div className={styles.background}>
            <PageTitle text="Register"/>
            <InterfaceBackground>
                <div className={styles.form_container}>
                    {error && <div className={styles.error_message}>{error}</div>}
                    
                    <div className={styles.input_container}>
                        <label className={styles.label}>Full Name *</label>
                        <input 
                            type="text" 
                            name="name"
                            className={styles.input_style} 
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Email *</label>
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
                        <label className={styles.label}>Birth Date</label>
                        <input 
                            type="date" 
                            name="birthDate"
                            className={styles.input_style}
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Password *</label>
                        <input 
                            type="password" 
                            name="password"
                            className={styles.input_style} 
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Confirm Password *</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            className={styles.input_style} 
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.button_container}>
                        <button 
                            className={styles.button_style} 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                    <div className={styles.link_container}>
                        <span className={styles.link_text}>Already have an account? </span>
                        <Link to="/login" className={styles.link}>Login here</Link>
                    </div>
                </div>
            </InterfaceBackground>
        </div>
    )
}