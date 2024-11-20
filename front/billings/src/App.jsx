
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RigisterPage';
import LoginPage from './pages/LoginPage';
import CustomerSearchPage from './pages/CustomerSearchPage';
import BillingPage from './pages/BillPage';
import VendorManagement from './pages/VendorManagement';
import DashboardPage from './pages/DashboardPage';
import Form from './pages/Form';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/form" element={<Form />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/search" element={<CustomerSearchPage />} />
                <Route path="/vendor-management" element={<VendorManagement />} />
            </Routes>
        </Router>
    );
}

export default App;

