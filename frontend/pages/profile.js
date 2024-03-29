// pages/profile.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
const baseURL = 'http://localhost:8000/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseURL}/profile`, {
                    headers: {
                        'auth-token': token
                    }
                });
                if (response.data.success) {
                    setProfile(response.data.data)
                } else {
                    window.location.href = '/login';
                    toast.error(response.data.message);
                }
            } catch (error) {
                window.location.href = '/login';
                toast.error(error.response.data.message);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = '/login';
      };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Profile</h1>
            {profile ? (
                <div>
                    {profile?.avatar ? <img src={`http://localhost:8000/${profile?.avatar}`} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto', display: 'block', marginBottom: '20px' }} />
                    : "" }
                    <p><strong>Name:</strong> {profile?.name}</p>
                    <p><strong>Email:</strong> {profile?.email}</p>
                    <button onClick={handleLogout} style={{ display: 'block', margin: '0 auto' }}>Logout</button>
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
