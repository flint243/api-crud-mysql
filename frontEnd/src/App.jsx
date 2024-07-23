import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Home';
import  'bootstrap/dist/css/bootstrap.min.css';
import Create from './components/Create';
import Update from './components/Update';
import Read from './components/Read';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/create' element={<Create />}/>
        <Route path='/read/:id' element={<Read />}/>
        <Route path='/update/:id' element={<Update />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
