import { useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import '../App.css';  // ✅ Import global CSS

export default function SearchPage() {
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem('token');

  const search = (newPage = 1) => {
    setPage(newPage);
    axios.get('http://localhost:5000/api/orders/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { customer_id: customerId, product_id: productId, status, page: newPage }
    }).then(res => {
      setResults(res.data.orders);
      setTotal(res.data.total);
    });
  };

  const totalPages = Math.ceil(total / 50);

  return (
    <>
      <NavBar />

      <div style={{ padding: '20px' }}>
        <h3>Search Orders</h3>

        <div style={{ marginBottom: '15px' }}>
          <input
            className="input-field"
            placeholder="Customer ID"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <input
            className="input-field"
            placeholder="Product ID"
            value={productId}
            onChange={e => setProductId(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <select
            className="input-field"
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={{ marginRight: '10px' }}
          >
            <option value="">--Status--</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
            <option value="Returned">Returned</option>
          </select>

          <button onClick={() => search(1)}>Search</button>
        </div>

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
            {results.map(o => (
              <tr key={o.order_id}>
                <td>{o.order_id}</td>
                <td>{o.customer_id}</td>
                <td>{o.product_id}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {results.length > 0 && (
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => search(page - 1)}>
              Prev
            </button>
            <span> Page {page} of {totalPages} </span>
            <button disabled={page >= totalPages} onClick={() => search(page + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
