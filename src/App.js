import './css/App.css';
import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ViewTableBookLover from "./component/booklover/ViewTable";
import Header from "./component/Header";
import Authorization from "./component/Authorization";
import BookViewTable from "./component/book/BookViewTable";
import PublishersViewTable from "./component/publisher/PublishersViewTable";
import RegionsViewTable from "./component/region/RegionsViewTable";


function App(props) {
    const headerTitle = "HeaderTitle"

    return (<div>
        <BrowserRouter>
            <Header title={headerTitle}/>
            <Routes>
                <Route path="/" element={<ViewTableBookLover title={"Home"}/>}/>
                <Route path="/books" element={<BookViewTable title={"First"}/>}/>
                <Route path="/publishers" element={<PublishersViewTable title={"Second"}/>}/>
                <Route path="/regions" element={<RegionsViewTable />}/>
                <Route path="/authorization" element={<Authorization title={"Second"}/>}/>
                <Route path="/books" element={<BookViewTable title={"Second"}/>}/>
                <Route path="*"
                       element={<Navigate to="/"/>}/> {/* Перенаправление на главную страницу если маршрут не найден */}
            </Routes>
        </BrowserRouter>
    </div>);
}

export default App;
