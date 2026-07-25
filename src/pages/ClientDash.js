import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, Stat } from '../components/UI';
import LOGO from '../data/logo';

const TABS = [
  {id:'bookings',label:'My Bookings',icon:'📅'},
  {id:'book',    label:'Book Service',icon:'➕'},
  {id:'profile', label:'My Profile',  icon:'👤'},
];

export default function ClientDash() {
  const { user, logout, setModal, bookings, cancelBooking, submitRating } = useApp();
  const [tab, setTab]           = useState('bookings');
  const [sideOpen, setSideOpen] = useState(false);
  const [rateModal, setRateModal] = useState(null); // bookingId
  const [stars, setStars]       = useState(0);
  const [comment, setComment]   = useState('');
  const myBks = bookings.filter(b=>b.clientEmail===user?.email||b.clientName===user?.name);

  const doRate = () => {
    if (!stars) return;
    submitRating(rateModal, stars, comment);
    setRateModal(null); setStars(0); setComment('');
  };

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#f8fafc'}}>
      {sideOpen&&<div onClick={()=>setSideOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:29}}/>}

      {/* Rating modal */}
      {rateModal&&(
        <div style={{position:'fixed',inset:0,zIndex:300,background:'rgba(10,20,40,.55)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:'#fff',borderRadius:18,padding:28,width:'100%',maxWidth:400,textAlign:'center'}}>
            <div style={{fontSize:40,marginBottom:8}}>⭐</div>
            <h3 style={{fontWeight:800,color:'#2B3BB5',marginBottom:6}}>Rate your Chores Pro</h3>
            <p style={{fontSize:13,color:'#64748b',marginBottom:18}}>How was your cleaning experience?</p>
            <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:16}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setStars(n)} style={{fontSize:34,background:'none',border:'none',cursor:'pointer',color:n<=stars?'#f59e0b':'#e5e7eb',transition:'color .15s'}}>★</button>
              ))}
            </div>
            <textarea className="form-input" rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment (optional)…" style={{marginBottom:14}}/>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>{setRateModal(null);setStars(0);setComment('');}} className="btn-outline" style={{flex:1}}>Cancel</button>
              <button onClick={doRate} disabled={!stars} className="btn-primary" style={{flex:1,opacity:stars?1:.4}}>Submit Rating</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`sidebar${sideOpen?' sidebar-open':''}`}>
        <div className="sidebar-logo-wrap"><img src={LOGO} alt="The Chores" style={{height:30,objectFit:'contain'}}/></div>
        <nav className="sb-nav">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSideOpen(false);}} className={`sb-item${tab===t.id?' active':''}`}>
              <span className="sb-icon">{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="sb-footer">
          <button onClick={()=>setModal('tc-client')} className="sb-item-sm">📄 Terms & Conditions</button>
          <button onClick={()=>setModal('privacy')} className="sb-item-sm">🔒 Privacy Policy</button>
          <button onClick={logout} className="sb-item">🚪 Logout</button>
        </div>
      </aside>

      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <header className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button onClick={()=>setSideOpen(true)} className="hamburger-btn"><span/><span/><span/></button>
            <span style={{fontWeight:600,fontSize:15,color:'#1f2937'}}>Hi, {user?.name?.split(' ')[0]} 👋</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="user-av">{user?.name?.[0]}{user?.name?.split(' ')[1]?.[0]}</div>
            <button onClick={logout} className="btn-sm-gray">Logout</button>
          </div>
        </header>

        <main style={{flex:1,overflowY:'auto',padding:'20px 20px 80px'}}>
          {tab==='bookings'&&<BookingsTab myBks={myBks} setTab={setTab} cancelBooking={cancelBooking} setRateModal={setRateModal}/>}
          {tab==='book'&&<BookTab setModal={setModal} setTab={setTab}/>}
          {tab==='profile'&&<ProfileTab/>}
        </main>

        <nav className="mob-bottom-nav">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`mbn-btn${tab===t.id?' active':''}`}>
              <span style={{fontSize:20}}>{t.icon}</span><span>{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function BookingsTab({myBks,setTab,cancelBooking,setRateModal}) {
  const upcoming = myBks.filter(b=>!['Completed','Cancelled'].includes(b.status));
  const completed = myBks.filter(b=>b.status==='Completed');
  return (
    <div style={{maxWidth:720}}>
      <div className="page-header">
        <div><h2 className="page-title">My Bookings</h2><p className="page-sub">Track and manage all your bookings</p></div>
        <button onClick={()=>setTab('book')} className="btn-primary">+ New Booking</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
        <Stat label="Upcoming" value={upcoming.length}/>
        <Stat label="Completed" value={completed.length}/>
        <Stat label="Total Spent" value={`£${myBks.filter(b=>b.payment==='Paid').reduce((s,b)=>s+b.amount,0)}`}/>
      </div>
      {myBks.length===0?(
        <div className="empty-state"><div className="empty-icon">📅</div><p className="empty-title">No bookings yet</p><button onClick={()=>setTab('book')} className="btn-primary">Book your first service →</button></div>
      ):(
        <>
          {upcoming.length>0&&<>{<h3 className="section-label">Upcoming</h3>}{upcoming.map(b=><BookCard key={b.id} b={b} cancelBooking={cancelBooking} setRateModal={setRateModal}/>)}</>}
          {completed.length>0&&<><h3 className="section-label" style={{marginTop:20}}>Completed</h3>{completed.map(b=><BookCard key={b.id} b={b} cancelBooking={cancelBooking} setRateModal={setRateModal}/>)}</>}
          {myBks.filter(b=>b.status==='Cancelled').length>0&&<><h3 className="section-label" style={{marginTop:20}}>Cancelled</h3>{myBks.filter(b=>b.status==='Cancelled').map(b=><BookCard key={b.id} b={b} cancelBooking={cancelBooking} setRateModal={setRateModal}/>)}</>}
        </>
      )}
    </div>
  );
}

function BookCard({b,cancelBooking,setRateModal}) {
  const canCancel = ['Pending','Confirmed'].includes(b.status);
  const canRate   = b.status==='Completed' && !b.rating;
  return (
    <div className="booking-card">
      <div style={{flex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6,flexWrap:'wrap'}}>
          <span style={{fontWeight:700,fontSize:15,color:'#1f2937'}}>{b.svc}</span>
          <Badge status={b.status}/>
          <span className={`payment-badge${b.payment==='Paid'?' paid':''}`}>{b.payment==='Paid'?'✅ Paid':'⏳ Payment Pending'}</span>
        </div>
        <div className="bk-meta">
          <span>📅 {b.date} at {b.time}</span>
          <span>⏱ {b.dur} hr{b.dur>1?'s':''}</span>
          <span>📍 {b.area}</span>
          <span>💷 £{b.amount}</span>
        </div>
        <p style={{fontSize:12,color:'#94a3b8',marginTop:4}}>📌 {b.address}{b.pro?<> · 👤 Pro: <strong>{b.pro}</strong></>:''}</p>
        {b.payment==='Pending'&&b.status!=='Cancelled'&&(
          <div className="payment-notice">📧 A payment link will be sent to your email. Please complete payment before your booking date.</div>
        )}
        {b.payment==='Paid'&&b.paymentDate&&<p style={{fontSize:11,color:'#16a34a',marginTop:4}}>✅ Payment received on {b.paymentDate}</p>}
        {b.jobSummary&&(
          <div style={{background:'#eff6ff',borderRadius:10,padding:'8px 12px',marginTop:6,fontSize:12}}>
            🕐 Checked in: <strong>{b.jobSummary.checkedIn}</strong>
            {b.jobSummary.minutesLate>0&&<span style={{color:'#dc2626',marginLeft:8}}>({b.jobSummary.minutesLate} min late)</span>}
            {b.jobSummary.minutesEarly>0&&<span style={{color:'#16a34a',marginLeft:8}}>({b.jobSummary.minutesEarly} min early)</span>}
            {b.jobSummary.completedAt&&<> · Completed: <strong>{b.jobSummary.completedAt}</strong></>}
          </div>
        )}
        {b.rating&&(
          <div style={{marginTop:6,fontSize:12,color:'#64748b'}}>
            Your rating: {'★'.repeat(b.rating)}{'☆'.repeat(5-b.rating)} {b.comment&&`— "${b.comment}"`}
          </div>
        )}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,flexShrink:0,alignItems:'flex-end'}}>
        <span style={{fontWeight:800,color:'#2B3BB5',fontSize:18}}>£{b.amount}</span>
        {canRate&&<button onClick={()=>setRateModal(b.id)} className="btn-primary" style={{padding:'7px 14px',fontSize:12}}>⭐ Rate</button>}
        {canCancel&&<button onClick={()=>cancelBooking(b.id)} className="btn-sm-outline-red">Cancel</button>}
      </div>
    </div>
  );
}

function BookTab({setModal,setTab}) {
  return (
    <div style={{maxWidth:600}}>
      <h2 className="page-title">Book a Service</h2>
      <p className="page-sub" style={{marginBottom:24}}>Choose from our range of professional cleaning services</p>
      <div className="info-box" style={{marginBottom:24}}>
        <span>📧</span>
        <p style={{fontSize:13,color:'#1b5e20'}}><strong>After booking, a payment link will be sent to your email.</strong> Please complete payment before your scheduled date to confirm your Chores Pro.</p>
      </div>
      <button onClick={()=>setModal('booking')} className="btn-primary" style={{width:'100%',padding:16,fontSize:16,borderRadius:14,marginBottom:12}}>📅 Open Booking Form →</button>
      <button onClick={()=>setTab('bookings')} className="btn-outline" style={{width:'100%',padding:14,fontSize:14,borderRadius:14}}>← Back to My Bookings</button>
    </div>
  );
}

function ProfileTab() {
  const {user,setClients,clients,toast,setModal} = useApp();
  const [f,setF] = useState({name:user?.name||'',email:user?.email||'',phone:user?.phone||'',address:user?.address||'',area:user?.area||''});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  const save = () => { setClients(prev=>prev.map(c=>c.id===user?.id?{...c,...f}:c)); toast('Profile updated!','ok'); };
  return (
    <div style={{maxWidth:500}}>
      <h2 className="page-title">My Profile</h2>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
          <div className="user-av-lg">{user?.name?.[0]}{user?.name?.split(' ')[1]?.[0]}</div>
          <div><p style={{fontWeight:700,fontSize:16}}>{user?.name}</p><p style={{fontSize:12,color:'#64748b'}}>{user?.email}</p></div>
        </div>
        <div className="form-row-2">
          <div className="form-group"><label className="form-label">Full name</label><input className="form-input" value={f.name} onChange={up('name')}/></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={f.email} onChange={up('email')}/></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={f.phone} onChange={up('phone')}/></div>
          <div className="form-group"><label className="form-label">Area</label><input className="form-input" value={f.area} onChange={up('area')}/></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={f.address} onChange={up('address')}/></div>
        <div style={{display:'flex',gap:10,marginTop:8,flexWrap:'wrap'}}>
          <button onClick={save} className="btn-primary">Save Changes</button>
          <button onClick={()=>setModal('tc-client')} className="btn-sm-gray">Terms & Conditions</button>
          <button onClick={()=>setModal('privacy')} className="btn-sm-gray">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
}
