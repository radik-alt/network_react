import '../css/App.css';
import React, {useState} from "react";
import {Link} from "react-router-dom";
import PublishersViewTable from "./publisher/PublishersViewTable";

function Header(props) {
// Проверяем, есть ли токен в localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    }

    console.log(localStorage.getItem('token'))


    return (
        <div className="header">
            <nav>
                <ul>
                    <li><Link to="/">BookLover</Link></li>
                    <li><Link to="/publishers">PublishersViewTable</Link></li>
                    <li><Link to="/regions">RegionsViewTable</Link></li>
                    <li><Link to="/books">Book</Link></li>
                </ul>
            </nav>
            {isAuthenticated ? (
                <button className="login-button" onClick={logout}>Выйти</button>
            ) : (
                <button className="login-button"><Link to="/authorization">Войти</Link></button>
            )}
        </div>
    );
}

export default Header;
