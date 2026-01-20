import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Chatbot from "../pages/Chatbot";
import Teste from "../pages/Teste";

const Routers = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path='/teste' element={<Teste/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Routers;