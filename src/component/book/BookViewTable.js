import React, {useEffect, useState} from "react";
import {RiDeleteBin6Line, RiEdit2Line} from "react-icons/ri";

function BookViewTable() {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);

    const fetchData = async () => {
        fetch(`http://localhost:8000/api/v1/books/?page=${currentPage}&page_size=${pageSize}`)
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
    }, []);


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
                            <tr key={volume.id}>
                                <td colSpan="3"></td>
                                {/* Placeholder for volume rows */}
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
            <h1>Таблица Books and Volumes</h1>
            {renderTable()}
        </div>
    );
}

export default BookViewTable;