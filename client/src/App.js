import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import SearchPage from './pages/SearchPage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/o/success" element={token ? <OrdersPage status="Delivered" /> : <Navigate to="/" />} />
        <Route path="/o/pending" element={token ? <OrdersPage status="Pending" /> : <Navigate to="/" />} />
        <Route path="/o/returned" element={token ? <OrdersPage status="Returned" /> : <Navigate to="/" />} />
        <Route path="/o/search" element={token ? <SearchPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
