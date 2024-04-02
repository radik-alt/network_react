import React, {useEffect, useState} from "react";

function EditPublisher({id, onClose}) {
    const [formData, setFormData] = useState({
        name: '',
        region: -1,
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
        if (validateForm()) {
            updateData(id, formData)
        }
    };

    const fetchPublisherData = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await fetch(`http://localhost:8000/api/v1/publishers/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const publisherData = await response.json();
            console.log(publisherData)
            setFormData({
                name: publisherData.name,
                region: publisherData.region,
            });

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchPublisherData(id);
    }, [id]);


    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.name) {
            alert("Введите название");
            isValid = false;
        }

        if (!formData.region) {
            alert("Введите id региона");
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
            console.log(filteredData)
            const response = await fetch(`http://localhost:8000/api/v1/publishers/${id}/`, {
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

            alert("Данные успешно добавлены!");
        } catch (error) {
            console.error('Error updating data:', error.message);
            alert("Не удалось добавить данные!");
        }
    };

    return (<div className="modal">
        <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            <h2>Создать запись книголюба</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name publisher:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="region">Id code region:</label>
                    <input type="text" id="region" name="region" value={formData.region} onChange={handleChange}/>
                </div>

                <button type="submit">Создать</button>
            </form>
        </div>
    </div>)
}

export default EditPublisher;