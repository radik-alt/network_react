import React, {useEffect, useState} from "react";
import {RiDeleteBin6Line, RiEdit2Line} from "react-icons/ri";
import CreatePublisher from "./CreatePublisher";
import EditPublisher from "./EditPublisher";

function PublishersViewTable() {
    const [publishers, setPublishers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [showFilter, setShowFilter] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false)
    const [chooseEditId, setChooseEditId] = useState(-1)
    const [showCreateModel, setShowCreateModel] = useState(false)
    const [filters, setFilters] = useState({
        ordering: '',
        name: '',
    });
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, filters]);

    const fetchData = () => {
        let url = `http://localhost:8000/api/v1/publishers/?page=${currentPage}&page_size=${pageSize}`;

        if (filters.ordering !== '') url += `&ordering=${filters.ordering}`;
        if (filters.name !== '') url += `&name=${filters.name}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPublishers(data);
                setRowCount(data.length)
                console.log(data)
            })
            .catch(error => {
                setRowCount(0)
                setPublishers(
                    [{
                        id: -1,
                        name: "",
                        region: -1
                    }]
                )
                console.error('Error fetching data:', error);
            });
    };

    const deleteItem = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Не удалось удалить запись! Проверьте авторизованы ли вы...")
                throw new Error('Token not found');
            }

            const response = await fetch(`http://localhost:8000/api/v1/publishers/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                alert("Не удалось удалить запись! Проверьте авторизованы ли вы...")
                throw new Error('Failed to fetch data');
            }
            fetchData()
            alert("Запись удалена!")
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    return (
        <div>
            <h2 className={"headerName"}>Таблица: Publisher</h2>
            {showCreateModel && <CreatePublisher id={chooseEditId}
                                               onClose={() => setShowCreateModel(false)}/>} {}
            {showEditModal && <EditPublisher id={chooseEditId}
                                           onClose={() => setShowEditModal(false)}/>} {}

            <div className={"filters-wrapper"} style={{display: showFilter ? 'block' : 'none'}}>
                <label htmlFor="ordering">Ordering:</label>
                <select
                    id="ordering"
                    value={filters.ordering}
                    className="ordering-select"
                    onChange={(e) => setFilters({...filters, ordering: e.target.value})}>
                    <option value="">-- Выберите порядок --</option>
                    <option value="asc">По возрастанию (asc)</option>
                    <option value="desc">По убыванию (desc)</option>
                </select>
                <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => setFilters({...filters, name: e.target.value})}
                    placeholder="Name regions to filter by"
                />
            </div>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>name publisher</th>
                    <th>region id</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {publishers && publishers.map((publisher, index) => (
                    <React.Fragment key={publisher.id}>
                        <tr>
                            <td>{publisher.id}</td>
                            <td>{publisher.name}</td>
                            <td>{publisher.region}</td>
                            <td>
                                <RiEdit2Line className="edit-icon" onClick={() => {
                                    setChooseEditId(publisher.id)
                                    setShowEditModal(!showEditModal)
                                }}/>
                            </td>
                            <td>
                                <RiDeleteBin6Line className="delete-icon" onClick={() => {
                                    deleteItem(publisher.id)
                                }
                                }/>
                            </td>
                            {/* Placeholder for publisher rows */}
                        </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            <div className={"pagination-wrapper"}>
                <button className={"pagination-button"} onClick={prevPage}>Предыдущая</button>
                <button className={"pagination-button"} onClick={nextPage}>Следующая</button>
            </div>
            <div className={"pagination-wrapper"}>
                <button className={"pagination-button"} onClick={() => setShowFilter(!showFilter)}>Показать/скрыть
                    фильтры
                </button>
                <button className={"pagination-button"} onClick={() => {
                    let token = localStorage.getItem("token");
                    if (token != null) {
                        setShowCreateModel(true)
                    } else {
                        alert("Не авторизованы")
                    }
                }}>Создать
                </button>
            </div>
            <div className={"count-wrapper"}>
                <p>По Вашему запросу найдено <b>{rowCount}</b> записей</p>
            </div>
        </div>
    );
}

export default PublishersViewTable;