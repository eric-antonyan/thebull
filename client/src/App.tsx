import React from 'react';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddTask from "./pages/AddTask";
import { NextUIProvider } from "@nextui-org/react";
import Task from "./pages/Task";
import EditTask from "./pages/EditTask";
import Login from "./pages/Login";
import Register from './pages/Register';
import Table from "./pages/Table";
import Settings from "./pages/Settings";

const App: React.FC = () => {
    return (
        <NextUIProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={""} element={<Login />} />
                    <Route path={"auth"}>
                        <Route path={"login"} />
                    </Route>
                    <Route path={"tasks"}>
                        <Route path={""} element={<Home />} />
                        <Route path={"new"} element={<AddTask />} />
                        <Route path={":taskId"}>
                            <Route path={""} element={<Task />} />
                            <Route path={"update"} element={<EditTask />} />
                        </Route>
                    </Route>
                    <Route path={"requests"} element={<Table />} />
                    <Route path='register' element={<Register />} />
                    <Route path='settings' element={<Settings />} />
                </Routes>
            </BrowserRouter>
        </NextUIProvider>
    );
};

export default App;
