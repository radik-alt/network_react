import React, {useState} from "react";
import "../../css/model.css";

function CreateBookLover({ id, onClose}) {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        birthday: '',
        date_of_joining: '',
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
        console.log(id)
        if (validateForm()) {
            updateData(id, formData)
        }
    };


    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.first_name) {
            alert("Введите имя");
            isValid = false;
        }

        if (!formData.last_name) {
            alert("Введите фамилию");
            isValid = false;
        }


        setErrors(errors);
        return isValid;
    };

    const updateData = async (id, newData) => {
        try {
            console.log(newData)
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const filteredData = Object.entries(newData).reduce((acc, [key, value]) => {
                if (value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {});
            console.log(filteredData)
            const response = await fetch(`http://localhost:8000/api/v1/booklovers/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filteredData)
            });

            if (!response.ok) {
                throw new Error('Failed to update data');
            }

            alert("Данные успешно добавлены!");
            // Дополнительные действия при успешном обновлении данных

        } catch (error) {
            console.error('Error updating data:', error.message);
            alert("Не удалось добавить данные!");
        }
    };


    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Создать запись книголюба</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="first_name">First Name:</label>
                        <input type="text" id="first_name" name="first_name" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last Name:</label>
                        <input type="text" id="last_name" name="last_name" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="middle_name">Middle Name:</label>
                        <input type="text" id="middle_name" name="middle_name" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthday">Birthday:</label>
                        <input type="date" id="birthday" name="birthday" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date_of_joining">Date of Joining:</label>
                        <input type="date" id="date_of_joining" name="date_of_joining" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" name="phone" onChange={handleChange}/>
                    </div>
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                    <button type="submit">Создать</button>
                </form>
            </div>
        </div>
    );
}

export default CreateBookLover;