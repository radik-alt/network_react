import React, {useEffect, useState} from "react";
import {RiDeleteBin6Line, RiEdit2Line} from "react-icons/ri";
import EditBookLover from "../booklover/EditBookLover";
import EditRegions from "./EditRegions";
import CreateRegions from "./CreateRegions";


function RegionsViewTable() {
    const [regions, setRegions] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false)
    const [chooseEditId, setchooseEditId] = useState(-1)
    const [showCreateModel, setShowCreateModel] = useState(false)
    const [showFilter, setShowFilter] = useState(false)

    const [filters, setFilters] = useState({
        ordering: '',
        name: '',
    });

    const fetchData = async () => {
        let url = `http://localhost:8000/api/v1/regions/?page=${currentPage}&page_size=${pageSize}`;

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
                console.log(data)
                setRegions(data);
                setRowCount(data.length);
            })
            .catch(error => {
                setRowCount(0);
                console.error('Error fetching table data:', error);
            });
    }

    useEffect(() => {
        fetchData()
    }, [currentPage, pageSize, filters]);


    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const deleteItem = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Не удалось удалить запись! Проверьте авторизованы ли вы...")
                throw new Error('Token not found');
            }

            const response = await fetch(`http://localhost:8000/api/v1/regions/${id}/`, {
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

    return (<div>
        <h1 className={"headerName"}>Название таблицы: Regions</h1>
        {showCreateModel && <CreateRegions id={chooseEditId}
                                           onClose={() => setShowCreateModel(false)}/>} {}
        {showEditModal && <EditRegions id={chooseEditId}
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
                <th>code</th>
                <th>name</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {regions.map(regions => (
                <React.Fragment key={regions.id}>
                    <tr>
                        <td>{regions.id}</td>
                        <td>{regions.code}</td>
                        <td>{regions.name}</td>
                        <td>
                            <RiEdit2Line className="edit-icon" onClick={() => {
                                setchooseEditId(regions.id)
                                setShowEditModal(!showEditModal)
                            }}/>
                        </td>
                        <td>
                            <RiDeleteBin6Line className="delete-icon" onClick={() => {
                                deleteItem(regions.id)
                            }
                            }/>
                        </td>
                        {/* Placeholder for regions rows */}
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
            <button className={"pagination-button"} onClick={() => {
                setShowCreateModel(true)
            }}>Создать
            </button>
            <button className={"pagination-button"} onClick={() => {setShowFilter(!showFilter)}}>Показать фильтры</button>
        </div>
        <div className={"count-wrapper"}>
            <p>По Вашему запросу найдено <b>{rowCount}</b> записей</p>
        </div>
    </div>)
}

export default RegionsViewTable;