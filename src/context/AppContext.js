import { createContext, useContext, useState, useCallback } from 'react';
import { ADMIN_CREDS, SEED_BOOKINGS, SEED_PROS, SEED_CLIENTS } from '../data/constants';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email||'').trim());
}

export function AppProvider({ children }) {
  const [screen, setScreen]         = useState('landing');
  const [modal, setModal]           = useState(null);
  const [user, setUser]             = useState(null);
  const [bookings, setBookings]     = useState(SEED_BOOKINGS);
  const [pros, setPros]             = useState(SEED_PROS);
  const [clients, setClients]       = useState(SEED_CLIENTS);
  const [adminCreds, setAdminCreds] = useState(ADMIN_CREDS);
  const [toasts, setToasts]         = useState([]);

  const toast = useCallback((msg, type='ok') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t,{id,msg,type}]);
    setTimeout(() => setToasts(t => t.filter(x=>x.id!==id)), 3500);
  },[]);

  const login = (email, password, role) => {
    const e = email.trim().toLowerCase();
    if (role==='admin') {
      if (e===adminCreds.email.toLowerCase() && password===adminCreds.password) {
        setUser({role:'admin',name:adminCreds.name,email:adminCreds.email});
        setScreen('admin'); setModal(null); return {ok:true};
      }
      return {ok:false,msg:'Incorrect email or password.'};
    }
    if (role==='pro') {
      const pro = pros.find(p=>p.email.toLowerCase()===e && p.password===password);
      if (pro) { setUser({...pro,role:'pro'}); setScreen('pro'); setModal(null); return {ok:true}; }
      return {ok:false,msg:'Incorrect email or password.'};
    }
    if (role==='client') {
      const cli = clients.find(c=>c.email.toLowerCase()===e && c.password===password);
      if (cli) { setUser({...cli,role:'client'}); setScreen('client'); setModal(null); return {ok:true}; }
      return {ok:false,msg:'Incorrect email or password.'};
    }
    return {ok:false,msg:'Unknown role.'};
  };

  const logout = () => { setUser(null); setScreen('landing'); };

  const clientSignup = (data) => {
    if (!isValidEmail(data.email)) return {ok:false,msg:'Please enter a valid email address.'};
    if (clients.find(c=>c.email.toLowerCase()===data.email.trim().toLowerCase()))
      return {ok:false,msg:'An account with this email already exists.'};
    if (data.password.length<6) return {ok:false,msg:'Password must be at least 6 characters.'};
    if (data.password!==data.confirm) return {ok:false,msg:'Passwords do not match.'};
    const newClient = {
      id:'CLI-'+Date.now(), name:data.name.trim(), email:data.email.trim().toLowerCase(),
      password:data.password, phone:data.phone.trim(),
      address:data.address, area:data.area, joinedAt:new Date().toISOString().slice(0,10),
    };
    setClients(p=>[...p,newClient]);
    setUser({...newClient,role:'client'});
    setScreen('client'); setModal(null);
    toast(`Welcome, ${data.name}! 🎉`);
    return {ok:true};
  };

  const proSignup = (data) => {
    if (!isValidEmail(data.email)) return {ok:false,msg:'Please enter a valid email address.'};
    if (pros.find(p=>p.email.toLowerCase()===data.email.trim().toLowerCase()))
      return {ok:false,msg:'A Pro account with this email already exists.'};
    if (data.password.length<6) return {ok:false,msg:'Password must be at least 6 characters.'};
    toast("Application submitted! We'll review and contact you within 24 hours. ✅");
    setModal(null);
    return {ok:true};
  };

  const addBooking    = (bk) => { setBookings(p=>[bk,...p]); toast('Booking confirmed! A payment link will be sent to your email. 📧'); };
  const updateBooking = (id,patch) => setBookings(p=>p.map(b=>b.id===id?{...b,...patch}:b));
  const assignPro     = (bookingId,proId) => { const pro=pros.find(p=>p.id===proId); if(!pro)return; updateBooking(bookingId,{pro:pro.name,proEmail:pro.email,status:'Confirmed'}); toast(`${pro.name} assigned ✅`); };
  const unassignPro   = (bookingId) => { updateBooking(bookingId,{pro:'',proEmail:'',status:'Pending'}); toast('Pro unassigned'); };
  const markPaymentReceived = (bookingId,amount,date) => { updateBooking(bookingId,{payment:'Paid',paymentDate:date||new Date().toISOString().slice(0,10),amount:amount||bookings.find(b=>b.id===bookingId)?.amount,status:'Confirmed'}); toast('Payment recorded ✅'); };
  const markComplete  = (id,summary) => { updateBooking(id,{status:'Completed',jobSummary:summary||null}); toast('Job marked complete! 🎉'); };
  const cancelBooking = (id) => { updateBooking(id,{status:'Cancelled'}); toast('Booking cancelled'); };
  const submitRating  = (bookingId,rating,comment) => { updateBooking(bookingId,{rating,comment}); toast('Thank you for your rating! ⭐'); };

  const updatePro = (id,patch) => setPros(p=>p.map(x=>x.id===id?{...x,...patch}:x));
  const deletePro = (id)       => setPros(p=>p.filter(x=>x.id!==id));

  const updateAdminCreds = (patch) => {
    setAdminCreds(p=>({...p,...patch}));
    if (patch.name) setUser(u=>({...u,name:patch.name}));
    toast('Admin details updated ✅');
  };

  return (
    <Ctx.Provider value={{
      screen,setScreen,modal,setModal,user,setUser,
      bookings,addBooking,updateBooking,assignPro,unassignPro,
      markPaymentReceived,markComplete,cancelBooking,submitRating,
      pros,setPros,updatePro,deletePro,
      clients,setClients,
      adminCreds,updateAdminCreds,
      login,logout,clientSignup,proSignup,
      toasts,toast,
    }}>
      {children}
    </Ctx.Provider>
  );
}
