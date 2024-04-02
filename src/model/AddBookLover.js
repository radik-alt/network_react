import React, { useState } from 'react';
import '../css/Forms.css'; // Импорт CSS файла

const AddBookLoverForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        middleName: '',
        birthday: '',
        dateOfJoining: '',
        address: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="form-container"> {/* Применяем класс form-container */}
            <h2>Add Book Lover</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input type="text" name="id" value={formData.id} onChange={handleChange} />
                </div>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <div>
                    <label>Middle Name:</label>
                    <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
                </div>
                <div>
                    <label>Birthday:</label>
                    <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
                </div>
                <div>
                    <label>Date of Joining:</label>
                    <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} />
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <button type="submit">Add Book Lover</button>
            </form>
        </div>
    );
};

export default AddBookLoverForm;
