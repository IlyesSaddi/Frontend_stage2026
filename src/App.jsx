import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Loginpage from './pages/LoginPage.jsx';
import Footer from './components/Footer.jsx';
import Devicepage from './pages/DevicesPage.jsx';
import Logoutpage from './pages/Logoutpage.jsx';
import Home from './pages/Home';
import Download from './pages/downloadzone.jsx';
import DeviceDetails from './components/DeviceDetails';
import Companypage from './pages/compaypage.jsx';
import Userspage from './pages/users.jsx';
import RequestPasswordResetForm from './components/RequestPasswordResetForm.jsx'
import ResetPasswordForm from './components/ResetPasswordForm.jsx'
import './styles/App.css';

function App() {
  return (
    <div className='app-container'>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/device" element={<Devicepage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/logout" element={<Logoutpage />} />
          <Route path="/downloadzone" element={<Download />} />
          <Route path="/device/:id" element={<DeviceDetails />} />
          <Route path="/company" element ={<Companypage/>}/>
          <Route path="/users" element ={<Userspage/>}/>
          <Route path="/forgot-password" element={<RequestPasswordResetForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
