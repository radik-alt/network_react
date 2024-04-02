import React, {useState} from "react";
import "../../css/auth.css";
import {redirect} from "react-router-dom";


const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const token = data.access;
            localStorage.setItem('token', token);
            console.log(token)
            redirect("/")
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2 className="form-title">Login</h2>
            <input
                className="input-field"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="input-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="submit-btn" type="submit">Login</button>
        </form>
    );

}


export default LoginScreen;
