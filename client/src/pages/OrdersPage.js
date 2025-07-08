import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';  // ✅ Navigation bar added
import '../App.css';  // ✅ Import global CSS

export default function OrdersPage({ status }) {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { status, page }
    }).then(res => {
      setOrders(res.data.orders);
      setTotal(res.data.total);
    });
  }, [status, page, token]);

  const totalPages = Math.ceil(total / 50);

  return (
    <>
      <NavBar />

      <div style={{ padding: '20px' }}>
        <h2>{status} Orders</h2>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_id}</td>
                <td>{order.product_id}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
            Prev
          </button>
          <span> Page {page} of {totalPages} </span>
          <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}
