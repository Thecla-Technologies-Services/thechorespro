import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, Stat } from '../components/UI';
import LOGO from '../data/logo';
import { SERVICES, AREAS } from '../data/constants';

const TABS=[
  {id:'overview', label:'Overview',     icon:'📊'},
  {id:'bookings', label:'All Bookings', icon:'📅'},
  {id:'customers',label:'Customers',    icon:'👥'},
  {id:'pros',     label:'Chores Pros',  icon:'✨'},
  {id:'payments', label:'Payments',     icon:'💳'},
  {id:'settings', label:'Settings',     icon:'⚙️'},
];

export default function AdminDash() {
  const {logout}=useApp();
  const [tab,setTab]=useState('overview');
  const [sideOpen,setSideOpen]=useState(false);
  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#f8fafc'}}>
      {sideOpen&&<div onClick={()=>setSideOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:29}}/>}
      <aside className={`sidebar sidebar-dark${sideOpen?' sidebar-open':''}`}>
        <div className="sidebar-logo-wrap">
          <img src={LOGO} alt="The Chores" style={{height:28,objectFit:'contain',filter:'brightness(10)'}}/>
          <span style={{fontSize:11,fontWeight:700,color:'#93c5fd',marginLeft:6}}>ADMIN</span>
        </div>
        <nav className="sb-nav">
          <p className="sb-section">Main</p>
          {TABS.slice(0,4).map(t=><SbBtn key={t.id} t={t} tab={tab} setTab={setTab} setSideOpen={setSideOpen}/>)}
          <p className="sb-section">Finance & Config</p>
          {TABS.slice(4).map(t=><SbBtn key={t.id} t={t} tab={tab} setTab={setTab} setSideOpen={setSideOpen}/>)}
        </nav>
        <div className="sb-footer">
          <button onClick={logout} className="sb-item" style={{color:'rgba(255,255,255,.5)'}}>🚪 Logout</button>
        </div>
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <header className="topbar topbar-dark">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button onClick={()=>setSideOpen(true)} className="hamburger-btn-white"><span/><span/><span/></button>
            <span style={{fontWeight:600,fontSize:15,color:'#fff'}}>Admin Portal</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="user-av" style={{background:'#3DB8E8'}}>AD</div>
            <button onClick={logout} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'6px 14px',borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:600,fontFamily:'inherit'}}>Logout</button>
          </div>
        </header>
        <main style={{flex:1,overflowY:'auto',padding:'20px 20px 40px'}}>
          {tab==='overview'  && <OverviewTab  setTab={setTab}/>}
          {tab==='bookings'  && <BookingsTab/>}
          {tab==='customers' && <CustomersTab/>}
          {tab==='pros'      && <ProsTab/>}
          {tab==='payments'  && <PaymentsTab/>}
          {tab==='settings'  && <SettingsTab/>}
        </main>
      </div>
    </div>
  );
}

function SbBtn({t,tab,setTab,setSideOpen}) {
  return (
    <button onClick={()=>{setTab(t.id);setSideOpen(false);}}
      className={`sb-item${tab===t.id?' active-dark':''}`}
      style={{color:tab===t.id?'#93c5fd':'rgba(255,255,255,.5)'}}>
      <span className="sb-icon">{t.icon}</span>{t.label}
    </button>
  );
}

/* ── Overview ── */
function OverviewTab({setTab}) {
  const {bookings,pros,clients}=useApp();
  const pending  = bookings.filter(b=>b.status==='Pending');
  const revenue  = bookings.filter(b=>b.payment==='Paid').reduce((s,b)=>s+b.amount,0);
  return (
    <div>
      <div className="page-header">
        <div><h2 className="page-title">Overview</h2><p className="page-sub">Real-time platform activity</p></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setTab('bookings')} className="btn-primary" style={{padding:'9px 18px',borderRadius:10,fontSize:14}}>All Bookings</button>
          <button onClick={()=>dlCSV(bookings)} className="btn-outline" style={{padding:'9px 18px',borderRadius:10,fontSize:14}}>⬇ Export</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:20}}>
        <Stat label="Total Bookings" value={bookings.length} sub={`${pending.length} pending`}/>
        <Stat label="Revenue Collected" value={`£${revenue}`} sub="Paid bookings" color="#16a34a"/>
        <Stat label="Active Pros" value={pros.filter(p=>p.status==='Active').length}/>
        <Stat label="Customers" value={clients.length}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:'#2B3BB5',marginBottom:14}}>Recent Bookings</h3>
          {bookings.slice(0,6).map(b=>(
            <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #f1f5f9'}}>
              <div><p style={{fontWeight:600,fontSize:12}}>{b.clientName}</p><p style={{fontSize:11,color:'#94a3b8'}}>{b.svc} · {b.date}</p></div>
              <Badge status={b.status}/>
            </div>
          ))}
          <button onClick={()=>setTab('bookings')} style={{fontSize:12,color:'#3DB8E8',fontWeight:600,background:'none',border:'none',cursor:'pointer',marginTop:10,fontFamily:'inherit'}}>View all →</button>
        </div>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:'#2B3BB5',marginBottom:14}}>Pending Actions</h3>
          {pending.filter(b=>!b.pro).length>0&&(
            <div style={{background:'#fef3c7',borderRadius:10,padding:'10px 12px',marginBottom:10,fontSize:13}}>
              <p style={{fontWeight:700,color:'#92400e'}}>⚠️ {pending.filter(b=>!b.pro).length} booking(s) need a Pro assigned</p>
              <button onClick={()=>setTab('bookings')} style={{fontSize:12,color:'#92400e',fontWeight:600,background:'none',border:'none',cursor:'pointer',marginTop:4,fontFamily:'inherit'}}>Assign now →</button>
            </div>
          )}
          {bookings.filter(b=>b.payment==='Pending'&&b.status!=='Cancelled').length>0&&(
            <div style={{background:'#fee2e2',borderRadius:10,padding:'10px 12px',fontSize:13}}>
              <p style={{fontWeight:700,color:'#dc2626'}}>💳 {bookings.filter(b=>b.payment==='Pending'&&b.status!=='Cancelled').length} payment(s) outstanding</p>
              <button onClick={()=>setTab('payments')} style={{fontSize:12,color:'#dc2626',fontWeight:600,background:'none',border:'none',cursor:'pointer',marginTop:4,fontFamily:'inherit'}}>View payments →</button>
            </div>
          )}
          {!pending.filter(b=>!b.pro).length&&!bookings.filter(b=>b.payment==='Pending'&&b.status!=='Cancelled').length&&(
            <p style={{color:'#16a34a',fontSize:13,fontWeight:600}}>✅ All caught up!</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── All Bookings ── */
function BookingsTab() {
  const {bookings,pros,assignPro,unassignPro,markComplete,cancelBooking,markPaymentReceived,updateBooking,toast}=useApp();
  const [filter,setFilter]=useState('all');
  const [search,setSearch]=useState('');
  const [payModal,setPayModal]=useState(null);
  const [payAmt,setPayAmt]=useState('');
  const [payDate,setPayDate]=useState(new Date().toISOString().split('T')[0]);
  const [editModal,setEditModal]=useState(null);
  const [editData,setEditData]=useState({});
  const filtered=bookings.filter(b=>filter==='all'||b.status===filter).filter(b=>!search||b.clientName?.toLowerCase().includes(search.toLowerCase())||b.svc?.toLowerCase().includes(search.toLowerCase())||b.id?.toLowerCase().includes(search.toLowerCase()));
  const openPay=(b)=>{setPayModal(b.id);setPayAmt(String(b.amount));setPayDate(new Date().toISOString().split('T')[0]);};
  const recordPay=()=>{markPaymentReceived(payModal,parseFloat(payAmt),payDate);setPayModal(null);};
  const openEdit=(b)=>{setEditData({...b});setEditModal(b.id);};
  const saveEdit=()=>{updateBooking(editModal,editData);setEditModal(null);toast('Booking updated','ok');};
  return (
    <div>
      <div className="page-header" style={{flexWrap:'wrap',gap:10}}>
        <div><h2 className="page-title">All Bookings</h2><p className="page-sub">{bookings.length} total</p></div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <input className="form-input" style={{width:180}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="form-input" style={{width:'auto'}} value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {['Pending','Confirmed','In progress','Completed','Cancelled'].map(s=><option key={s}>{s}</option>)}
          </select>
          <button onClick={()=>dlCSV(bookings)} className="btn-success-sm">⬇ CSV</button>
          <button onClick={()=>dlPDF(bookings)} className="btn-outline-sm">⬇ PDF</button>
        </div>
      </div>
      {payModal&&(
        <div className="mini-modal-wrap" onClick={e=>e.target===e.currentTarget&&setPayModal(null)}>
          <div className="mini-modal">
            <h3 style={{fontWeight:700,color:'#2B3BB5',marginBottom:4}}>Record Payment</h3>
            <p style={{fontSize:12,color:'#64748b',marginBottom:14}}>Booking #{payModal}</p>
            <div className="form-group"><label className="form-label">Amount paid (£)</label><input type="number" className="form-input" value={payAmt} onChange={e=>setPayAmt(e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Payment date</label><input type="date" className="form-input" value={payDate} onChange={e=>setPayDate(e.target.value)}/></div>
            <div style={{display:'flex',gap:10,marginTop:10}}>
              <button onClick={()=>setPayModal(null)} className="btn-outline" style={{flex:1,padding:'10px',borderRadius:10}}>Cancel</button>
              <button onClick={recordPay} className="btn-primary" style={{flex:1,padding:'10px',borderRadius:10}}>✅ Record</button>
            </div>
          </div>
        </div>
      )}
      {editModal&&(
        <div className="mini-modal-wrap" onClick={e=>e.target===e.currentTarget&&setEditModal(null)}>
          <div className="mini-modal" style={{maxWidth:500}}>
            <h3 style={{fontWeight:700,color:'#2B3BB5',marginBottom:14}}>Edit Booking #{editModal}</h3>
            <div className="form-row-2">
              <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={editData.date||''} onChange={e=>setEditData(p=>({...p,date:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Time</label><input type="time" className="form-input" value={editData.time||''} onChange={e=>setEditData(p=>({...p,time:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Duration (hrs)</label><input type="number" className="form-input" value={editData.dur||''} onChange={e=>setEditData(p=>({...p,dur:+e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Amount (£)</label><input type="number" className="form-input" value={editData.amount||''} onChange={e=>setEditData(p=>({...p,amount:+e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="form-input" value={editData.status||''} onChange={e=>setEditData(p=>({...p,status:e.target.value}))}>
                  {['Pending','Confirmed','In progress','Completed','Cancelled'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" rows={2} value={editData.notes||''} onChange={e=>setEditData(p=>({...p,notes:e.target.value}))}/></div>
            <div style={{display:'flex',gap:10,marginTop:10}}>
              <button onClick={()=>setEditModal(null)} className="btn-outline" style={{flex:1,padding:'10px',borderRadius:10}}>Cancel</button>
              <button onClick={saveEdit} className="btn-primary" style={{flex:1,padding:'10px',borderRadius:10}}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      <div style={{overflowX:'auto',background:'#fff',borderRadius:14,border:'1px solid #e5e7eb'}}>
        <table className="admin-table">
          <thead><tr>{['ID','Customer','Service','Date/Time','Area','Amount','Payment','Status','Pro','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(b=>(
              <tr key={b.id}>
                <td style={{fontFamily:'monospace',fontSize:11,color:'#94a3b8'}}>{b.id}</td>
                <td><p style={{fontWeight:600,fontSize:13}}>{b.clientName}</p><p style={{fontSize:11,color:'#94a3b8'}}>{b.clientEmail}</p><p style={{fontSize:11,color:'#94a3b8'}}>{b.clientPhone}</p></td>
                <td style={{fontSize:13}}>{b.svc}</td>
                <td style={{fontSize:12}}><p>{b.date}</p><p style={{color:'#94a3b8'}}>{b.time} · {b.dur}h</p></td>
                <td style={{fontSize:12}}>{b.area}</td>
                <td><span style={{fontWeight:800,color:'#2B3BB5',fontSize:14}}>£{b.amount}</span></td>
                <td>
                  <span className={`payment-badge${b.payment==='Paid'?' paid':''}`} style={{fontSize:11,display:'block',marginBottom:2}}>{b.payment==='Paid'?'✅ Paid':'⏳ Pending'}</span>
                  {b.payment==='Paid'&&b.paymentDate&&<p style={{fontSize:10,color:'#16a34a'}}>{b.paymentDate}</p>}
                </td>
                <td><Badge status={b.status}/></td>
                <td>
                  {b.pro
                    ?<div><p style={{fontSize:12,fontWeight:600}}>{b.pro}</p><button onClick={()=>unassignPro(b.id)} style={{fontSize:10,color:'#dc2626',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:'inherit'}}>✕ Unassign</button></div>
                    :<select className="form-input" style={{width:140,fontSize:12,padding:'5px 8px'}} defaultValue="" onChange={e=>{if(e.target.value)assignPro(b.id,e.target.value);e.target.value='';}}>
                      <option value="">Assign Pro…</option>
                      {pros.filter(p=>p.status==='Active').map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  }
                </td>
                <td>
                  <div style={{display:'flex',flexDirection:'column',gap:4}}>
                    {b.payment!=='Paid'&&b.status!=='Cancelled'&&<button onClick={()=>openPay(b)} className="btn-xs-green">💳 Record Pay</button>}
                    <button onClick={()=>openEdit(b)} className="btn-xs-blue">✏️ Edit</button>
                    {!['Completed','Cancelled'].includes(b.status)&&<button onClick={()=>markComplete(b.id)} className="btn-xs-green">✅ Done</button>}
                    {!['Cancelled','Completed'].includes(b.status)&&<button onClick={()=>cancelBooking(b.id)} className="btn-xs-red">✕ Cancel</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div className="empty-state"><div className="empty-icon">📭</div><p className="empty-title">No bookings found</p></div>}
      </div>
    </div>
  );
}

/* ── Customers ── */
function CustomersTab() {
  const {clients,bookings}=useApp();
  return (
    <div>
      <div className="page-header"><div><h2 className="page-title">Customers</h2><p className="page-sub">{clients.length} registered customers</p></div></div>
      <div style={{overflowX:'auto',background:'#fff',borderRadius:14,border:'1px solid #e5e7eb'}}>
        <table className="admin-table">
          <thead><tr>{['Name','Email','Phone','Area','Address','Bookings','Joined'].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {clients.map(c=>{
              const cb=bookings.filter(b=>b.clientEmail===c.email);
              return(<tr key={c.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="user-av" style={{width:28,height:28,fontSize:11}}>{c.name?.[0]}{c.name?.split(' ')[1]?.[0]}</div><span style={{fontWeight:600,fontSize:13}}>{c.name}</span></div></td>
                <td style={{fontSize:12}}>{c.email}</td>
                <td style={{fontSize:12}}>{c.phone}</td>
                <td style={{fontSize:12}}>{c.area}</td>
                <td style={{fontSize:11,color:'#64748b',maxWidth:180}}>{c.address}</td>
                <td style={{textAlign:'center',fontWeight:700,color:'#2B3BB5'}}>{cb.length}</td>
                <td style={{fontSize:11,color:'#94a3b8'}}>{c.joinedAt}</td>
              </tr>);
            })}
          </tbody>
        </table>
        {clients.length===0&&<div className="empty-state"><div className="empty-icon">👥</div><p className="empty-title">No customers yet</p></div>}
      </div>
    </div>
  );
}

/* ── Pros ── */
function ProsTab() {
  const {pros,setPros,bookings,updatePro,deletePro,toast}=useApp();
  const [editId,setEditId]=useState(null);
  const [editD,setEditD]=useState({});
  const [addOpen,setAddOpen]=useState(false);
  const [newPro,setNewPro]=useState({name:'',email:'',phone:'',address:'',area:'',cleaning_preference:'',password:'pro123'});
  const [svcs,setSvcs]=useState([]);
  const [formErr,setFormErr]=useState('');
  const upNew=k=>e=>setNewPro(p=>({...p,[k]:e.target.value}));
  const toggleSvc=s=>setSvcs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const openEdit=p=>{setEditD({...p});setEditId(p.id);};
  const saveEdit=()=>{updatePro(editId,editD);setEditId(null);toast('Pro updated ✅','ok');};
  const addNewPro=()=>{
    setFormErr('');
    if(!newPro.name.trim()){setFormErr('Full name required.');return;}
    if(!newPro.email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(newPro.email)){setFormErr('Valid email required.');return;}
    if(!newPro.phone.trim()){setFormErr('Phone required.');return;}
    if(!newPro.area){setFormErr('Please select an area.');return;}
    if(svcs.length===0){setFormErr('Please select at least one service.');return;}
    if(pros.find(p=>p.email.toLowerCase()===newPro.email.trim().toLowerCase())){setFormErr('A Pro with this email already exists.');return;}
    const p={id:'PRO-'+Date.now(),name:newPro.name.trim(),email:newPro.email.trim().toLowerCase(),phone:newPro.phone.trim(),address:newPro.address.trim(),area:newPro.area,cleaning_preference:newPro.cleaning_preference,password:newPro.password||'pro123',services:svcs,status:'Active',rating:5.0,jobsDone:0,joinedAt:new Date().toISOString().slice(0,10)};
    setPros(prev=>[...prev,p]);
    toast(`✅ ${p.name} added as a Chores Pro!`,'ok');
    setAddOpen(false);setNewPro({name:'',email:'',phone:'',address:'',area:'',cleaning_preference:'',password:'pro123'});setSvcs([]);setFormErr('');
  };
  return (
    <div>
      <div className="page-header"><div><h2 className="page-title">Chores Pros</h2><p className="page-sub">{pros.length} registered Pros</p></div><button onClick={()=>setAddOpen(true)} className="btn-primary" style={{padding:'9px 18px',borderRadius:10,fontSize:14}}>+ Add Pro</button></div>
      {addOpen&&(
        <div className="mini-modal-wrap" onClick={e=>e.target===e.currentTarget&&setAddOpen(false)}>
          <div className="mini-modal" style={{maxWidth:540}}>
            <h3 style={{fontWeight:700,color:'#2B3BB5',marginBottom:14}}>Add New Chores Pro</h3>
            <div className="form-row-2">
              <div className="form-group"><label className="form-label">Full name <span className="req">*</span></label><input className="form-input" value={newPro.name} onChange={upNew('name')} placeholder="John Adeyemi"/></div>
              <div className="form-group"><label className="form-label">Email <span className="req">*</span></label><input className="form-input" type="email" value={newPro.email} onChange={upNew('email')}/></div>
              <div className="form-group"><label className="form-label">Phone <span className="req">*</span></label><input className="form-input" value={newPro.phone} onChange={upNew('phone')}/></div>
              <div className="form-group"><label className="form-label">Area <span className="req">*</span></label><select className="form-input" value={newPro.area} onChange={upNew('area')}><option value="">Select area</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Cleaning preference</label><select className="form-input" value={newPro.cleaning_preference} onChange={upNew('cleaning_preference')}><option value="">Select</option><option>Residential</option><option>Commercial</option><option>Both</option></select></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" value={newPro.password} onChange={upNew('password')}/></div>
            </div>
            <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={newPro.address} onChange={upNew('address')}/></div>
            <div className="form-group"><label className="form-label">Services <span className="req">*</span></label><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{SERVICES.map(s=><button key={s.id} type="button" onClick={()=>toggleSvc(s.name)} className={`svc-chip${svcs.includes(s.name)?' active':''}`} style={{fontSize:12}}>{s.icon} {s.name}</button>)}</div></div>
            {formErr&&<div className="form-err-box">{formErr}</div>}
            <div style={{display:'flex',gap:10,marginTop:12}}>
              <button onClick={()=>{setAddOpen(false);setFormErr('');}} className="btn-outline" style={{flex:1,padding:'10px',borderRadius:10}}>Cancel</button>
              <button onClick={addNewPro} className="btn-primary" style={{flex:1,padding:'10px',borderRadius:10}}>Add Pro →</button>
            </div>
          </div>
        </div>
      )}
      {editId&&(
        <div className="mini-modal-wrap" onClick={e=>e.target===e.currentTarget&&setEditId(null)}>
          <div className="mini-modal" style={{maxWidth:480}}>
            <h3 style={{fontWeight:700,color:'#2B3BB5',marginBottom:14}}>Edit Pro — {editD.name}</h3>
            <div className="form-row-2">
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={editD.name||''} onChange={e=>setEditD(p=>({...p,name:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={editD.email||''} onChange={e=>setEditD(p=>({...p,email:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={editD.phone||''} onChange={e=>setEditD(p=>({...p,phone:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Area</label><input className="form-input" value={editD.area||''} onChange={e=>setEditD(p=>({...p,area:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Status</label><select className="form-input" value={editD.status||''} onChange={e=>setEditD(p=>({...p,status:e.target.value}))}><option>Active</option><option>Inactive</option></select></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" value={editD.password||''} onChange={e=>setEditD(p=>({...p,password:e.target.value}))}/></div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:10}}>
              <button onClick={()=>setEditId(null)} className="btn-outline" style={{flex:1,padding:'10px',borderRadius:10}}>Cancel</button>
              <button onClick={saveEdit} className="btn-primary" style={{flex:1,padding:'10px',borderRadius:10}}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      <div style={{overflowX:'auto',background:'#fff',borderRadius:14,border:'1px solid #e5e7eb'}}>
        <table className="admin-table">
          <thead><tr>{['Name','Email','Phone','Area','Pref','Services','Jobs','Rating','Status','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {pros.map(p=>{
              const pj=bookings.filter(b=>b.proEmail===p.email);
              return(<tr key={p.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="user-av" style={{width:28,height:28,fontSize:11,background:'#2B3BB5'}}>{p.name?.[0]}{p.name?.split(' ')[1]?.[0]}</div><span style={{fontWeight:600,fontSize:13}}>{p.name}</span></div></td>
                <td style={{fontSize:12}}>{p.email}</td>
                <td style={{fontSize:12}}>{p.phone}</td>
                <td style={{fontSize:12}}>{p.area}</td>
                <td style={{fontSize:12}}>{p.cleaning_preference}</td>
                <td><div style={{display:'flex',flexWrap:'wrap',gap:3}}>{(p.services||[]).slice(0,2).map(s=><span key={s} style={{background:'#eff6ff',color:'#2B3BB5',fontSize:10,fontWeight:600,padding:'2px 6px',borderRadius:20}}>{s}</span>)}{(p.services||[]).length>2&&<span style={{fontSize:10,color:'#94a3b8'}}>+{p.services.length-2}</span>}</div></td>
                <td style={{textAlign:'center',fontWeight:700}}>{pj.length}</td>
                <td style={{fontWeight:700,color:'#f59e0b'}}>⭐ {p.rating}</td>
                <td><Badge status={p.status}/></td>
                <td><div style={{display:'flex',gap:4}}><button onClick={()=>openEdit(p)} className="btn-xs-blue">✏️ Edit</button><button onClick={()=>{if(window.confirm('Delete this Pro?'))deletePro(p.id);}} className="btn-xs-red">🗑</button></div></td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Payments ── */
function PaymentsTab() {
  const {bookings,markPaymentReceived}=useApp();
  const [payModal,setPayModal]=useState(null);
  const [payAmt,setPayAmt]=useState('');
  const [payDate,setPayDate]=useState(new Date().toISOString().split('T')[0]);
  const paid=bookings.filter(b=>b.payment==='Paid');
  const pending=bookings.filter(b=>b.payment!=='Paid'&&b.status!=='Cancelled');
  const total=paid.reduce((s,b)=>s+b.amount,0);
  const openPay=b=>{setPayModal(b.id);setPayAmt(String(b.amount));};
  const recordPay=()=>{markPaymentReceived(payModal,parseFloat(payAmt),payDate);setPayModal(null);};
  return (
    <div>
      <div className="page-header"><div><h2 className="page-title">Payments</h2><p className="page-sub">Track and record all customer payments</p></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
        <Stat label="Total Collected" value={`£${total}`} color="#16a34a"/>
        <Stat label="Outstanding" value={`£${pending.reduce((s,b)=>s+b.amount,0)}`} color="#dc2626"/>
        <Stat label="Paid Bookings" value={paid.length}/>
      </div>
      {payModal&&(
        <div className="mini-modal-wrap" onClick={e=>e.target===e.currentTarget&&setPayModal(null)}>
          <div className="mini-modal">
            <h3 style={{fontWeight:700,color:'#2B3BB5',marginBottom:14}}>Record Payment — {payModal}</h3>
            <div className="form-group"><label className="form-label">Amount paid (£)</label><input type="number" className="form-input" value={payAmt} onChange={e=>setPayAmt(e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Payment date</label><input type="date" className="form-input" value={payDate} onChange={e=>setPayDate(e.target.value)}/></div>
            <div style={{display:'flex',gap:10,marginTop:12}}>
              <button onClick={()=>setPayModal(null)} className="btn-outline" style={{flex:1,padding:'10px',borderRadius:10}}>Cancel</button>
              <button onClick={recordPay} className="btn-primary" style={{flex:1,padding:'10px',borderRadius:10}}>✅ Record Payment</button>
            </div>
          </div>
        </div>
      )}
      {pending.length>0&&(<>
        <h3 style={{fontWeight:700,fontSize:14,color:'#dc2626',marginBottom:10}}>⏳ Outstanding ({pending.length})</h3>
        <div style={{overflowX:'auto',background:'#fff',borderRadius:14,border:'1px solid #fca5a5',marginBottom:20}}>
          <table className="admin-table">
            <thead><tr>{['Booking','Customer','Service','Date','Amount','Status','Action'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>{pending.map(b=>(
              <tr key={b.id}>
                <td style={{fontFamily:'monospace',fontSize:11,color:'#94a3b8'}}>{b.id}</td>
                <td><span style={{fontWeight:600,fontSize:13}}>{b.clientName}</span><br/><span style={{fontSize:11,color:'#94a3b8'}}>{b.clientEmail}</span></td>
                <td style={{fontSize:13}}>{b.svc}</td>
                <td style={{fontSize:12}}>{b.date}</td>
                <td style={{fontWeight:800,color:'#2B3BB5',fontSize:14}}>£{b.amount}</td>
                <td><Badge status={b.status}/></td>
                <td><button onClick={()=>openPay(b)} className="btn-xs-green">💳 Record Payment</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </>)}
      <h3 style={{fontWeight:700,fontSize:14,color:'#16a34a',marginBottom:10}}>✅ Paid ({paid.length})</h3>
      <div className="table-wrap">
          <table className="admin-table">
          <thead><tr>{['Booking','Customer','Service','Date','Amount Paid','Payment Date','Pro'].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>{paid.map(b=>(
            <tr key={b.id}>
              <td style={{fontFamily:'monospace',fontSize:11,color:'#94a3b8'}}>{b.id}</td>
              <td style={{fontWeight:600,fontSize:13}}>{b.clientName}</td>
              <td style={{fontSize:13}}>{b.svc}</td>
              <td style={{fontSize:12}}>{b.date}</td>
              <td style={{fontWeight:800,color:'#16a34a',fontSize:14}}>£{b.amount}</td>
              <td style={{fontSize:12,color:'#16a34a',fontWeight:600}}>{b.paymentDate||'—'}</td>
              <td style={{fontSize:12}}>{b.pro||'—'}</td>
            </tr>
          ))}</tbody>
        </table>
        {paid.length===0&&<div className="empty-state"><div className="empty-icon">💳</div><p className="empty-title">No paid bookings yet</p></div>}
      </div>
    </div>
  );
}

/* ── Settings ── */
function SettingsTab() {
  const {adminCreds,updateAdminCreds,toast}=useApp();
  const [f,setF]=useState({name:adminCreds.name,email:adminCreds.email,password:'',confirmPw:''});
  const up=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(f.password&&f.password!==f.confirmPw){toast('Passwords do not match','err');return;}
    if(f.password&&f.password.length<6){toast('Password must be at least 6 characters','err');return;}
    const patch={name:f.name,email:f.email};
    if(f.password) patch.password=f.password;
    updateAdminCreds(patch);
    setF(p=>({...p,password:'',confirmPw:''}));
  };
  return (
    <div style={{maxWidth:500}}>
      <div className="page-header"><div><h2 className="page-title">Admin Settings</h2><p className="page-sub">Manage your admin login details</p></div></div>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
          <div className="user-av-lg" style={{background:'#2B3BB5'}}>AD</div>
          <div><p style={{fontWeight:700,fontSize:16}}>{adminCreds.name}</p><p style={{fontSize:12,color:'#64748b'}}>{adminCreds.email}</p><p style={{fontSize:11,color:'#94a3b8'}}>Administrator · Full access</p></div>
        </div>
        <div className="form-group"><label className="form-label">Display Name</label><input className="form-input" value={f.name} onChange={up('name')}/></div>
        <div className="form-group"><label className="form-label">Login Email</label><input className="form-input" type="email" value={f.email} onChange={up('email')}/></div>
        <div style={{borderTop:'1px solid #f1f5f9',paddingTop:16,marginTop:8}}>
          <p style={{fontWeight:600,fontSize:13,color:'#374151',marginBottom:10}}>Change Password</p>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">New password</label><input className="form-input" type="password" value={f.password} onChange={up('password')} placeholder="Leave blank to keep current"/></div>
            <div className="form-group"><label className="form-label">Confirm password</label><input className="form-input" type="password" value={f.confirmPw} onChange={up('confirmPw')}/></div>
          </div>
        </div>
        <div style={{background:'#fef3c7',border:'1px solid #fbbf24',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#92400e',marginBottom:14}}>⚠️ Changing your login details takes effect immediately. Remember your new credentials.</div>
        <button onClick={save} className="btn-primary" style={{width:'100%',padding:13,borderRadius:12,fontSize:15}}>Save Admin Settings</button>
      </div>
    </div>
  );
}

/* ── Download helpers ── */
function dlCSV(bookings) {
  const hdr='ID,Customer,Email,Phone,Service,Date,Time,Dur,Area,Address,Amount,Payment,PayDate,Status,Pro,Rating,Comment\n';
  const rows=bookings.map(b=>`${b.id},"${b.clientName}","${b.clientEmail}","${b.clientPhone}","${b.svc}","${b.date}","${b.time}","${b.dur}","${b.area}","${b.address}",£${b.amount},"${b.payment}","${b.paymentDate||''}","${b.status}","${b.pro||''}","${b.rating||''}","${b.comment||''}"`).join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(hdr+rows);
  a.download=`thechores-bookings-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}
function dlPDF(bookings) {
  const html=`<html><head><style>body{font-family:Arial,sans-serif;font-size:11px;padding:20px}h1{color:#2B3BB5;margin-bottom:4px}p{color:#64748b;margin-bottom:14px}table{width:100%;border-collapse:collapse}th{background:#2B3BB5;color:#fff;padding:7px 8px;text-align:left;font-size:10px}td{padding:7px 8px;border-bottom:1px solid #eee}tr:nth-child(even){background:#f7fbfe}</style></head><body><h1>The Chores — Bookings Report</h1><p>Generated: ${new Date().toLocaleString()} | Total: ${bookings.length} bookings</p><table><thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Date</th><th>Area</th><th>Amount</th><th>Payment</th><th>Status</th><th>Pro</th><th>Rating</th></tr></thead><tbody>${bookings.map(b=>`<tr><td>${b.id}</td><td>${b.clientName}<br/><small>${b.clientPhone}</small></td><td>${b.svc}</td><td>${b.date} ${b.time}</td><td>${b.area}</td><td>£${b.amount}</td><td>${b.payment}${b.paymentDate?' ('+b.paymentDate+')':''}</td><td>${b.status}</td><td>${b.pro||'—'}</td><td>${b.rating?'★'.repeat(b.rating):'—'}</td></tr>`).join('')}</tbody></table></body></html>`;
  const w=window.open('','_blank');
  w.document.write(html);w.document.close();
  setTimeout(()=>w.print(),300);
}
