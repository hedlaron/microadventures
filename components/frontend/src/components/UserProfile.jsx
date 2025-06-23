// src/UserProfile.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>User Profile</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default UserProfile;