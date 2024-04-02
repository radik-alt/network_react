import React, {useEffect, useState} from "react";
import "../../css/model.css";

function EditBookLover({id, onClose}) {

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
        const {name, value} = e.target;
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

    const fetchBookLoverData = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await fetch(`http://localhost:8000/api/v1/booklovers/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const bookLoverData = await response.json();
            setFormData({
                first_name: bookLoverData.first_name,
                last_name: bookLoverData.last_name,
                middle_name: bookLoverData.middle_name,
                birthday: bookLoverData.birthday,
                date_of_joining: bookLoverData.date_of_joining,
                address: bookLoverData.address,
                phone: bookLoverData.phone
            });
            console.log(formData);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const updateData = async (id, newData) => {
        try {
            console.log(newData)
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const queryString = new URLSearchParams({id}).toString(); // Генерация query string
            const filteredData = Object.entries(newData).reduce((acc, [key, value]) => {
                if (value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {});
            console.log(filteredData)
            const response = await fetch(`http://localhost:8000/api/v1/booklovers/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filteredData)
            });

            if (!response.ok) {
                throw new Error('Failed to update data');
            }

            alert("Данные успешно обновлены!");
            // Дополнительные действия при успешном обновлении данных

        } catch (error) {
            console.error('Error updating data:', error.message);
            alert("Не удалось обновить данные!");
        }
    };

    useEffect(() => {

        fetchBookLoverData(id); // Вызов функции при монтировании компонента
    }, [id]);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Изменение записи</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" value={formData.first_name}  name="firstName" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" value={formData.last_name} name="lastName" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="middleName">Middle Name:</label>
                        <input type="text" id="middleName" value={formData.middle_name} name="middleName" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthday">Birthday:</label>
                        <input type="date" id="birthday" value={formData.birthday} name="birthday" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfJoining">Date of Joining:</label>
                        <input type="date" id="dateOfJoining" value={formData.date_of_joining} name="dateOfJoining" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" value={formData.address} name="address" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" value={formData.phone} name="phone" onChange={handleChange}/>
                    </div>
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                    <button type="submit">Изменить</button>
                </form>
            </div>
        </div>
    );
}

export default EditBookLover;