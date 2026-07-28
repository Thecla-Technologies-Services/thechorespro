import { createContext, useContext, useState, useCallback } from 'react';
import { ADMIN_CREDS, SEED_BOOKINGS, SEED_PROS, SEED_CLIENTS, calcProEarnings } from '../data/constants';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
export function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((e||'').trim()); }
export function isValidPhone(p) { return /^[\d\s+\-()\\.]{7,15}$/.test((p||'').trim()); }

export function AppProvider({ children }) {
  const [screen,setScreen]         = useState('landing');
  const [modal,setModal]           = useState(null);
  const [user,setUser]             = useState(null);
  const [bookings,setBookings]     = useState(SEED_BOOKINGS);
  const [pros,setPros]             = useState(SEED_PROS);
  const [clients,setClients]       = useState(SEED_CLIENTS);
  const [adminCreds,setAdminCreds] = useState(ADMIN_CREDS);
  const [toasts,setToasts]         = useState([]);

  const toast = useCallback((msg, type='ok') => {
    const id = Date.now()+Math.random();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),4000);
  },[]);

  const login = (email,password,role) => {
    const e=email.trim().toLowerCase();
    if(role==='admin'){
      if(e===adminCreds.email.toLowerCase()&&password===adminCreds.password){setUser({role:'admin',name:adminCreds.name,email:adminCreds.email});setScreen('admin');setModal(null);return{ok:true};}
      return{ok:false,msg:'Incorrect email or password.'};
    }
    if(role==='pro'){
      const pro=pros.find(p=>p.email.toLowerCase()===e&&p.password===password);
      if(pro){setUser({...pro,role:'pro'});setScreen('pro');setModal(null);return{ok:true};}
      return{ok:false,msg:'Incorrect email or password.'};
    }
    if(role==='client'){
      const cli=clients.find(c=>c.email.toLowerCase()===e&&c.password===password);
      if(cli){setUser({...cli,role:'client'});setScreen('client');setModal(null);return{ok:true};}
      return{ok:false,msg:'Incorrect email or password.'};
    }
    return{ok:false,msg:'Unknown role.'};
  };

  const logout=()=>{setUser(null);setScreen('landing');};

  const clientSignup=(data)=>{
    if(!isValidEmail(data.email)) return{ok:false,msg:'Please enter a valid email address.'};
    if(clients.find(c=>c.email.toLowerCase()===data.email.trim().toLowerCase())) return{ok:false,msg:'This email is already registered. Please log in.'};
    if(data.phone&&clients.find(c=>c.phone===data.phone.trim())) return{ok:false,msg:'This phone number is already registered.'};
    if(data.password.length<6) return{ok:false,msg:'Password must be at least 6 characters.'};
    if(data.password!==data.confirm) return{ok:false,msg:'Passwords do not match.'};
    const nc={id:'CLI-'+Date.now(),name:data.name.trim(),email:data.email.trim().toLowerCase(),password:data.password,phone:data.phone.trim(),address:data.address,area:data.area,joinedAt:new Date().toISOString().slice(0,10)};
    setClients(p=>[...p,nc]);
    setUser({...nc,role:'client'});
    setScreen('client');setModal(null);
    toast('Welcome, '+data.name+'! 🎉');
    return{ok:true};
  };

  const proSignup=(data)=>{
    if(!isValidEmail(data.email)) return{ok:false,msg:'Please enter a valid email address.'};
    if(pros.find(p=>p.email.toLowerCase()===data.email.trim().toLowerCase())) return{ok:false,msg:'A Pro account with this email already exists.'};
    if(data.phone&&pros.find(p=>p.phone===data.phone.trim())) return{ok:false,msg:'This phone number is already registered.'};
    if(data.password.length<6) return{ok:false,msg:'Password must be at least 6 characters.'};
    toast("Application submitted! We'll review and contact you within 24 hours. ✅");
    setModal(null);
    return{ok:true};
  };

  const updateBooking=(id,patch)=>setBookings(p=>p.map(b=>b.id===id?{...b,...patch}:b));
  const addBooking=(bk)=>{setBookings(p=>[bk,...p]);toast('Booking confirmed! A payment link will be sent to your email. 📧');};

  const assignPro=(bookingId,proId,assignNote='')=>{
    const pro=pros.find(p=>p.id===proId);
    if(!pro) return;
    updateBooking(bookingId,{pro:pro.name,proEmail:pro.email,status:'Confirmed',assignNote});
    toast(pro.name+' assigned ✅');
  };
  const unassignPro=(bookingId)=>{updateBooking(bookingId,{pro:'',proEmail:'',status:'Pending',assignNote:''});toast('Pro unassigned');};
  const markPaymentReceived=(bookingId,amount,date)=>{
    updateBooking(bookingId,{payment:'Paid',paymentDate:date||new Date().toISOString().slice(0,10),amount:amount||bookings.find(b=>b.id===bookingId)?.amount});
    toast('Customer payment recorded ✅');
  };
  const markProPayment=(bookingId,amount,date)=>{
    updateBooking(bookingId,{proPayment:'Paid',proPaymentDate:date||new Date().toISOString().slice(0,10),proEarnings:amount});
    toast('Pro payment recorded ✅');
  };
  const markComplete=(id,summary)=>{
    const bk=bookings.find(b=>b.id===id);
    const proEarnings=summary?calcProEarnings(summary.actualMins,summary.scheduledMins):(bk?.proEarnings||0);
    updateBooking(id,{status:'Completed',jobSummary:summary||null,proEarnings});
    toast('Job marked complete! 🎉');
  };
  const markInProgress=(id,checkedIn)=>{
    updateBooking(id,{status:'In progress',checkedInTime:checkedIn,jobStartedAt:new Date().toISOString()});
  };
  const cancelBooking=(id)=>{updateBooking(id,{status:'Cancelled'});toast('Booking cancelled — all parties notified');};
  const submitRating=(bookingId,rating,comment)=>{updateBooking(bookingId,{rating,comment});toast('Thank you for your rating! ⭐');};

  const updatePro=(id,patch)=>setPros(p=>p.map(x=>x.id===id?{...x,...patch}:x));
  const deletePro=(id)=>setPros(p=>p.filter(x=>x.id!==id));
  const updateAdminCreds=(patch)=>{
    setAdminCreds(p=>({...p,...patch}));
    if(patch.name) setUser(u=>({...u,name:patch.name}));
    toast('Admin details updated ✅');
  };

  return(
    <Ctx.Provider value={{
      screen,setScreen,modal,setModal,user,setUser,
      bookings,addBooking,updateBooking,assignPro,unassignPro,
      markPaymentReceived,markProPayment,markComplete,markInProgress,
      cancelBooking,submitRating,
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
