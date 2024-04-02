import React, {useEffect, useState} from "react";
import {RiDeleteBin6Line, RiEdit2Line} from "react-icons/ri";

function PublishersViewTable() {
    const [data, setData] = useState([

    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

// Функция для перехода на следующую страницу
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);

    const fetchData = () => {
        fetch(`http://localhost:8000/api/v1/publishers/?page=${currentPage}&page_size=${pageSize}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(data.results);
                console.log(data)
            })
            .catch(error => {
                setData(
                    {
                        id: -1,
                        name: "",
                        region: -1
                    }
                )
                console.error('Error fetching data:', error);
            });
    };

    return (
        <div>
            <h2>Publisher Data</h2>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>name publisher</th>
                    <th>region id</th>
                </tr>
                </thead>
                <tbody>
                {data.map(regions => (
                    <React.Fragment key={regions.id}>
                        <tr>
                            <td>{regions.id}</td>
                            <td>{regions.code}</td>
                            <td>{regions.name}</td>
                            <td>
                                <RiEdit2Line className="edit-icon" onClick={() => {
                                    // setchooseEditId(regions.id)
                                    // setShowEditModal(!showEditModal)
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
            <div className={"count-wrapper"}>
                <p>По Вашему запросу найдено <b>{rowCount}</b> записей</p>
            </div>
        </div>
    );
}

export default PublishersViewTable;