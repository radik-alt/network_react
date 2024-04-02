import React, {useEffect, useState} from "react";

function CreateRegions({id, onClose}) {
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
    const validateForm = () => {
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

    const createData = async (id, newData) => {
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
            const response = await fetch(`http://localhost:8000/api/v1/regions/`, {
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

            alert("Данные успешно созданы!");

        } catch (error) {
            console.error('Error updating data:', error.message);
            alert("Не удалось создать новые данные!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(formData)
            createData(id, formData)
        }
    };

    return (<div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Создать данные о регионе</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Название региона:</label>
                        <input type="text" id="name" value={formData.name} name="name"
                               onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="code">Код региона:</label>
                        <input type="text" id="code" value={formData.code} name="code"
                               onChange={handleChange}/>
                    </div>

                    <button type="submit">Создать</button>
                </form>
            </div>
        </div>
    );
}

export default CreateRegions;