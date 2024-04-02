import React, {useState} from "react";
import "../../css/Forms.css"

function CreateBook({id, onClose}) {
    const [formData, setFormData] = useState({
        title: '',
        publisher: 0,
        year_of_release: '',
        volumes: [
            {
                volume_number: '',
                number_of_pages: ''
            }
        ]
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
            const response = await fetch(`http://localhost:8000/api/v1/books/`, {
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

    const handleVolumeChange = (index, e) => {
        const {name, value} = e.target;
        const newVolumes = [...formData.volumes]; // Создаем копию массива volumes
        newVolumes[index] = {...newVolumes[index], [name]: value}; // Обновляем данные конкретного элемента
        setFormData({...formData, volumes: newVolumes}); // Устанавливаем новый массив в состояние формы
    };

    const addVolume = () => {
        setFormData(prevState => ({
            ...prevState,
            volumes: [...prevState.volumes, {volume_number: '', number_of_pages: ''}]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        createData(id, formData)
        // Отправка данных
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Создать данные о книге</h2>
                <span className="close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="publisher">Publisher:</label>
                        <input type="number" id="publisher" name="publisher" value={formData.publisher}
                               onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="year_of_release">Year of Release:</label>
                        <input type="number" id="year_of_release" name="year_of_release"
                               value={formData.year_of_release} onChange={handleChange}/>
                    </div>
                    <div>
                        <h3>Volumes</h3>
                        {formData.volumes.map((volume, index) => (
                            <div key={index}>
                                <div className="form-group">
                                    <label htmlFor={`volume_number`}>Volume Number:</label>
                                    <input type="number" id={`volume_number`}
                                           name={`volume_number`}
                                           onChange={(e) => handleVolumeChange(index, e)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`number_of_pages`}>Number of Pages:</label>
                                    <input type="number" id={`number_of_pages`}
                                           name={`number_of_pages`}
                                           onChange={(e) => handleVolumeChange(index, e)}/>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addVolume}>Add Volume</button>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CreateBook;