import React, {useEffect, useState} from "react";
import "../../css/Table.css";
import {RiDeleteBin6Line, RiEdit2Line} from "react-icons/ri";
import EditBookLover from "./EditBookLover";
import CreateBookLover from "./CreateBookLover";


function ViewTableBookLover(props) {
    const [tableData, setTableData] = useState([]);
    const [tableName, setTableName] = useState('Таблица BookLover');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [chooseEdit, setChooseEdit] = useState(-1)
    const [showFilters, setShowFilters] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const [filters, setFilters] = useState({
        ordering: '',
        first_name: '',
        birthday: '',
        date_of_joining: ''
    });
    const [showModal, setShowModal] = useState(false);


    const deleteItem = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Не удалось удалить запись! Проверьте авторизованы ли вы...")
                throw new Error('Token not found');
            }

            const response = await fetch(`http://localhost:8000/api/v1/booklovers/?page=${currentPage}&page_size=${pageSize}`, {
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

            alert("Запись удалена!")
            fetchData()
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };


    const fetchData = () => {
        let url = `http://localhost:8000/api/v1/booklovers/?page=${currentPage}&page_size=${pageSize}`;

        if (filters.ordering !== '') url += `&ordering=${filters.ordering}`;
        if (filters.first_name !== '') url += `&first_name=${filters.first_name}`;
        if (filters.birthday !== '') url += `&birthday=${filters.birthday}`;
        if (filters.date_of_joining !== '') url += `&date_of_joining=${filters.date_of_joining}`;


        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setTableData(data);
                setRowCount(data.length);
            })
            .catch(error => {
                setRowCount(0);
                setTableData([{
                    id_book_lover: 0,
                    first_name: '-',
                    last_name: '-',
                    middle_name: '-',
                    birthday: '-',
                    date_of_joining: '-',
                    address: '-',
                    phone: '-',
                }])
                console.error('Error fetching table data:', error);
            });
    };

    useEffect(() => {
        document.title = tableName;
        fetchData();
    }, [currentPage, pageSize, filters]);
// Функция для перехода на предыдущую страницу
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

// Функция для перехода на следующую страницу
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };


    const applyFilters = () => {
        // Функция для применения фильтров
        console.log("Применить фильтры:", filters);
        // Здесь можете использовать значения фильтров из состояния filters для запроса данных
    };

    const handleDateChange = (value, field) => {
        // Проверяем, содержит ли значение символы "." или "-"
        if (value.includes('.') || value.includes('-')) {
            // Преобразуем дату в формат "ГГГГ-ММ-ДД"
            const formattedDate = value.split('.').reverse().join('-');
            setFilters({...filters, [field]: formattedDate});
        } else {
            setFilters({...filters, [field]: value});
        }
    };

    return (
        <div className={"general-wrapper"}>
            {showModal && <EditBookLover id={chooseEdit}
                                         onClose={() => setShowModal(false)}/>} {}
            {showCreate && <CreateBookLover id={chooseEdit}
                                            onClose={() => setShowCreate(false)}/>} {}
            <h1 className={"headerName"}>Название таблицы: {tableName}</h1>
            <div className={"filters-wrapper"} style={{display: showFilters ? 'block' : 'none'}}>
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
                    value={filters.first_name}
                    onChange={(e) => setFilters({...filters, first_name: e.target.value})}
                    placeholder="First name to filter by"
                />
                <input
                    type="date"
                    value={filters.birthday}
                    onChange={(e) => setFilters({...filters, birthday: e.target.value})}
                    placeholder="Birthday to filter by"
                />
                <input
                    type="date"
                    value={filters.date_of_joining}
                    onChange={(e) => setFilters({...filters, date_of_joining: e.target.value})}
                    placeholder="Date of joining to filter by"
                />
            </div>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Middle Name</th>
                    <th>Birthday</th>
                    <th>Date of Joining</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    {/*<th>View</th>*/}
                </tr>
                </thead>
                <tbody>
                {tableData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.id_book_lover + 1}</td>
                        <td> {item.first_name}</td>
                        <td>{item.last_name}</td>
                        <td>{item.middle_name}</td>
                        <td>{new Date(item.birthday).toLocaleDateString()}</td>
                        <td>{new Date(item.date_of_joining).toLocaleDateString()}</td>
                        <td>{item.address}</td>
                        <td>{item.phone}</td>
                        <td>
                            <RiEdit2Line className="edit-icon" onClick={() => {
                                let token = localStorage.getItem("token")
                                if (token != null) {
                                    setChooseEdit(item.id_book_lover)
                                    setShowModal(true);
                                } else {
                                    alert("Не авторизованы")
                                }
                            }}/>
                        </td>
                        <td>
                            <RiDeleteBin6Line className="delete-icon" onClick={() =>
                                deleteItem(item.id_book_lover)
                            }/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className={"pagination-wrapper"}>
                <button className={"pagination-button"} onClick={prevPage}>Предыдущая</button>
                <button className={"pagination-button"} onClick={nextPage}>Следующая</button>
            </div>
            <div className={"pagination-wrapper"}>
                <button className={"pagination-button"} onClick={() => setShowFilters(!showFilters)}>Показать/скрыть
                    фильтры
                </button>
                <button className={"pagination-button"} onClick={() => {
                    let token = localStorage.getItem("token");
                    if (token != null) {
                        setShowCreate(true)
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

export default ViewTableBookLover;