// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';
const baseURL = 'http://localhost:8000/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseURL}/auth/register`, formData);
            if (response.data.success) {
                toast.success('Registration successful');
                router.push('/login');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} style={{ width: '100%', marginBottom: '10px' }} />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{ width: '100%', marginBottom: '10px' }} />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={{ width: '100%', marginBottom: '10px' }} />
                <button type="submit" style={{ width: '100%', padding: '10px 0', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
        </div>
    );
};

export default Register;
