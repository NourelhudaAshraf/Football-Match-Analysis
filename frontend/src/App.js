import React  from 'react';
import Login from './components/Login.js';
import Home from './components/Home.js';
import Userprofile from './components/Userprofile.js';
import History from './components/History.js';
import Dashboard from "./components/Dashboard.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import Navbar from './components/Navbar.js';
import { BrowserRouter ,Routes , Route } from 'react-router-dom';
const App = () => {
  return (
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path = "/" element={<Home/>} ></Route>
            <Route path = "/login" element={<Login/>} ></Route>
            <Route path = "/profile" element={<Userprofile/>} ></Route>
            <Route path = "/history" element={<History/>} ></Route>
            <Route path = "/dashboard" element={<Dashboard/>} ></Route>
          </Routes>
    </BrowserRouter>
  );
};

export default App;