// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from "motion/react"; // ✅ motion.dev の API を使用

// ✅ 各ページコンポーネント
import LoginForm from './components/Login/LoginForm';
import Reception from './pages/Reception';
import SelectStaff from './pages/SelectStaff';
import InputForm from './pages/InputForm';
import Calling from './pages/ReceptionCalling';
import DeliveryAndInfoCalling from './pages/DeliveryAndInfoCalling';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Keyboard from './components/common/Keyboard';
import WaitScreen from './pages/WaitScreen';

// ✅ アニメーション付きでルーティングをレンダリングするためのラッパーコンポーネント
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoginForm />
          </motion.div>
        } />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/reception" element={
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Reception />
          </motion.div>
        } />

        <Route path="/select-staff" element={<SelectStaff />} />
        <Route path="/input" element={<InputForm />} />
        <Route path="/calling" element={<Calling />} />
        <Route path="/seliveryandInfocalling" element={<DeliveryAndInfoCalling />} />
        <Route path="/keyboard" element={<Keyboard />} />
        <Route path="/waitscreen" element={<WaitScreen />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;