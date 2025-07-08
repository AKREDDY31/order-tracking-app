import { useNavigate } from 'react-router-dom';
import '../App.css';  // ✅ Import CSS

export default function NavBar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav>
      <a href="/o/success">Delivered</a>
      <a href="/o/pending">Pending</a>
      <a href="/o/returned">Returned</a>
      <a href="/o/search">Search</a>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
