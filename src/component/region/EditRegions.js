import React, {useEffect, useState} from "react";

function EditRegions({id, onClose}) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const fetchRegionsData = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await fetch(`http://localhost:8000/api/v1/regions/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const regionsData = await response.json();
            setFormData({
                code: regionsData.code,
                name: regionsData.name,
            });

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchRegionsData(id);
    }, [id]);

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.name) {
            alert("Введите название");
            isValid = false;
        }

        if (!formData.code) {
            alert("Введите код");
            isValid = false;
        }


        return isValid;
    };

    const updateData = async (id, newData) => {
        try {
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
            const response = await fetch(`http://localhost:8000/api/v1/regions/${id}/`, {
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

        } catch (error) {
            console.error('Error updating data:', error.message);
            alert("Не удалось обновить данные!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            updateData(id, formData)
        }
    };

    return (<div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Изменение региона</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Название:</label>
                        <input type="text" id="name" value={formData.name} name="name"
                               onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="code">Last Name:</label>
                        <input type="text" id="code" value={formData.code} name="code"
                               onChange={handleChange}/>
                    </div>

                    <button type="submit">Изменить</button>
                </form>
            </div>
        </div>
    );
}

export default EditRegions;