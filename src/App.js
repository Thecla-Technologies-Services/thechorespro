import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import ClientDash from './pages/ClientDash';
import ProDash from './pages/ProDash';
import AdminDash from './pages/AdminDash';
import { LoginModal, SignupClientModal, SignupProModal, BookingModal, TCClientModal, TCProModal, PrivacyModal } from './components/Modals';
import { ToastContainer } from './components/UI';
import './index.css';

function Router(){
  const {screen}=useApp();
  return(<>
    {screen==='landing'&&<Landing/>}
    {screen==='client'&&<ClientDash/>}
    {screen==='pro'&&<ProDash/>}
    {screen==='admin'&&<AdminDash/>}
    <LoginModal/><SignupClientModal/><SignupProModal/><BookingModal/>
    <TCClientModal/><TCProModal/><PrivacyModal/><ToastContainer/>
  </>);
}
export default function App(){
  return(<AppProvider><Router/></AppProvider>);
}
