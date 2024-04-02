import React, {useEffect, useState} from "react";
import {RiDeleteBin6Line, RiEdit2Line} from "react-icons/ri";
import CreateBook from "./CreateBook";
import EditBook from "./EditBook";

function BookViewTable() {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [chooseEdit, setChooseEdit] = useState(-1)
    const [showFilters, setShowFilters] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        ordering: '',
        title: '',
        year: '',
    });
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

// Функция для перехода на следующую страницу
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const fetchData = async () => {
        let url = `http://localhost:8000/api/v1/books/?page=${currentPage}&page_size=${pageSize}`

        if (filters.ordering !== '') url += `&ordering=${filters.ordering}`;
        if (filters.title !== '') url += `&title=${filters.title}`;
        if (filters.year !== '') url += `&year=${filters.year}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setBooks(data);
                setRowCount(data.length);
            })
            .catch(error => {
                setRowCount(0);
                console.error('Error fetching table data:', error);
            });
    }

    useEffect(() => {
        fetchData()
    }, [pageSize, currentPage, filters]);


    const deleteItem = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Не удалось удалить запись! Проверьте авторизованы ли вы...")
                throw new Error('Token not found');
            }

            const response = await fetch(`http://localhost:8000/api/v1/books/${id}/`, {
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


    const renderTable = () => {
        return (
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Publisher</th>
                    <th>Year of Release</th>
                    <th>Volume Number</th>
                    <th>Number of Pages</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {books.map(book => (
                    <React.Fragment key={book.id_book}>
                        <tr>
                            <td>{book.id_book}</td>
                            <td>{book.title}</td>
                            <td>{book.publisher}</td>
                            <td>{book.year_of_release}</td>
                            <td colSpan="2"></td>
                            <td>
                                <RiEdit2Line className="edit-icon" onClick={() => {
                                }}/>
                            </td>
                            <td>
                                <RiDeleteBin6Line className="delete-icon" onClick={() =>
                                    deleteItem(book.id_book)
                                }/>
                            </td>
                            {/* Placeholder for book rows */}
                        </tr>
                        {book.volumes.map(volume => (
                            <tr key={volume.id_volume}>
                                <td colSpan="4"></td>
                                <td>{volume.volume_number}</td>
                                <td>{volume.number_of_pages}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <h1 className={"headerName"}>Таблица Books and Volumes</h1>
            {showModal && <EditBook id={chooseEdit}
                                    onClose={() => setShowModal(false)}/>} {}
            {showCreate && <CreateBook id={chooseEdit}
                                       onClose={() => setShowCreate(false)}/>} {}

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
                    value={filters.title}
                    onChange={(e) => setFilters({...filters, title: e.target.value})}
                    placeholder="title name to filter by"
                />
                <input
                    type="text"
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    placeholder="year to filter by"
                />
            </div>

            {renderTable()}
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

export default BookViewTable;