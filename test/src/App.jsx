import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Reception from './pages/Reception'; // 作成した受付画面
import SelectStaff from './pages/SelectStaff';
import InputForm from './pages/InputForm';
import Calling from './pages/ReceptionCalling';
import DeliveryAndInfoCalling from './pages/DeliveryAndInfoCalling';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/reception" element={<Reception />} />
        <Route path="/select-staff" element={<SelectStaff />}/>
        <Route path='/input' element={<InputForm/>} />
        <Route path='/calling' element={<Calling />} />
        <Route path='/seliveryandInfocalling' element={<DeliveryAndInfoCalling />}/>

      </Routes>
    </Router>
  );
}

export default App;
