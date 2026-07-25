import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, Stat } from '../components/UI';
import LOGO from '../data/logo';

const TABS = [
  {id:'jobs',     label:"Today's Jobs", icon:'💼'},
  {id:'upcoming', label:'Upcoming',     icon:'📅'},
  {id:'earnings', label:'Earnings',     icon:'💰'},
  {id:'comms',    label:'Comms',        icon:'💬'},
  {id:'profile',  label:'Profile',      icon:'👤'},
];

export default function ProDash() {
  const {user,logout,setModal,bookings,markComplete,toast} = useApp();
  const [tab,setTab]         = useState('jobs');
  const [sideOpen,setSideOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const myJobs    = bookings.filter(b=>b.proEmail===user?.email||b.pro===user?.name);
  const todaysJobs = myJobs.filter(b=>b.date===today&&!['Completed','Cancelled'].includes(b.status));
  const upcoming   = myJobs.filter(b=>b.date>today&&!['Completed','Cancelled'].includes(b.status));
  const completed  = myJobs.filter(b=>b.status==='Completed');

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#f8fafc'}}>
      {sideOpen&&<div onClick={()=>setSideOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:29}}/>}
      <aside className={`sidebar${sideOpen?' sidebar-open':''}`}>
        <div className="sidebar-logo-wrap">
          <img src={LOGO} alt="The Chores" style={{height:30,objectFit:'contain'}}/>
          <span style={{fontSize:11,fontWeight:700,color:'#2B3BB5',marginLeft:6}}>PRO</span>
        </div>
        <nav className="sb-nav">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSideOpen(false);}} className={`sb-item${tab===t.id?' active':''}`}>
              <span className="sb-icon">{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="sb-footer">
          <button onClick={()=>setModal('tc-pro')} className="sb-item-sm">📄 Terms & Conditions</button>
          <button onClick={()=>setModal('privacy')} className="sb-item-sm">🔒 Privacy Policy</button>
          <button onClick={logout} className="sb-item">🚪 Logout</button>
        </div>
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <header className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button onClick={()=>setSideOpen(true)} className="hamburger-btn"><span/><span/><span/></button>
            <span style={{fontWeight:600,fontSize:15,color:'#1f2937'}}>Hi, {user?.name?.split(' ')[0]} ✨</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="user-av" style={{background:'#2B3BB5'}}>{user?.name?.[0]}{user?.name?.split(' ')[1]?.[0]}</div>
            <button onClick={logout} className="btn-sm-gray">Logout</button>
          </div>
        </header>
        <main style={{flex:1,overflowY:'auto',padding:'16px 16px 88px'}}>
          {tab==='jobs'     && <TodayTab todaysJobs={todaysJobs} myJobs={myJobs} markComplete={markComplete} toast={toast}/>}
          {tab==='upcoming' && <UpcomingTab upcoming={upcoming}/>}
          {tab==='earnings' && <EarningsTab completed={completed}/>}
          {tab==='comms'    && <CommsTab myJobs={myJobs} toast={toast}/>}
          {tab==='profile'  && <ProProfile/>}
        </main>
        <nav className="mob-bottom-nav">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`mbn-btn${tab===t.id?' active':''}`}>
              <span style={{fontSize:18}}>{t.icon}</span>
              <span style={{fontSize:9}}>{t.label.split("'")[0].split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ── Today's Jobs ── */
function TodayTab({todaysJobs,myJobs,markComplete,toast}) {
  const today = new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  return (
    <div style={{maxWidth:700}}>
      <div className="page-header">
        <div><h2 className="page-title">Today's Jobs</h2><p className="page-sub">{today}</p></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
        <Stat label="Today" value={todaysJobs.length} color="#2B3BB5"/>
        <Stat label="All Assigned" value={myJobs.length} color="#2B3BB5"/>
        <Stat label="Rating" value="4.9 ⭐" color="#f59e0b"/>
      </div>
      {todaysJobs.length===0
        ? <div className="empty-state"><div className="empty-icon">☀️</div><p className="empty-title">No jobs scheduled for today</p><p style={{color:'#94a3b8',fontSize:13}}>Check Upcoming for your next assignments</p></div>
        : todaysJobs.map(job=><JobCard key={job.id} job={job} markComplete={markComplete} toast={toast}/>)
      }
    </div>
  );
}

/* ── Job Card with live timer, revealed info, summary ── */
function JobCard({job,markComplete,toast}) {
  const [started,setStarted]     = useState(false);
  const [paused,setPaused]       = useState(false);
  const [secs,setSecs]           = useState(0);
  const [checkinTime,setCheckin] = useState(null);
  const [done,setDone]           = useState(false);
  const [summary,setSummary]     = useState(null);
  const ref = useRef(null);

  useEffect(()=>{
    if(started&&!paused){ ref.current=setInterval(()=>setSecs(s=>s+1),1000); }
    else clearInterval(ref.current);
    return ()=>clearInterval(ref.current);
  },[started,paused]);

  const fmt = s => {
    const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`;
  };

  // Calculate late/early
  const getTimeDiff = (scheduledTime, actualTime) => {
    const [sh,sm] = scheduledTime.split(':').map(Number);
    const [ah,am] = actualTime.split(':').map(Number);
    return (ah*60+am) - (sh*60+sm);
  };

  const checkIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
    setCheckin(timeStr);
    setStarted(true); setPaused(false);
    const diff = getTimeDiff(job.time, timeStr);
    if(diff>0) toast(`Checked in — ${diff} min late. Timer started. ⏱`,'ok');
    else if(diff<0) toast(`Checked in — ${Math.abs(diff)} min early! Timer started. ⏱`,'ok');
    else toast('Checked in on time! Timer started. ⏱','ok');
  };

  const pause  = () => { setPaused(true);  toast('Timer paused','ok'); };
  const resume = () => { setPaused(false); toast('Timer resumed ▶','ok'); };

  const finish = () => {
    clearInterval(ref.current);
    const now = new Date();
    const completedAt = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
    const diffIn  = checkinTime ? getTimeDiff(job.time, checkinTime) : 0;
    const scheduledEnd = (() => {
      const [h,m] = job.time.split(':').map(Number);
      const total = h*60+m+job.dur*60;
      return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
    })();
    const diffOut = getTimeDiff(scheduledEnd, completedAt);
    const s = {
      scheduledTime: job.time,
      checkedIn: checkinTime||completedAt,
      completedAt,
      minutesLate:   diffIn>0  ? diffIn  : 0,
      minutesEarly:  diffOut<0 ? Math.abs(diffOut) : 0,
      minutesOverrun: diffOut>0 ? diffOut : 0,
      totalMins: Math.floor(secs/60),
    };
    setSummary(s);
    setDone(true);
    markComplete(job.id, s);
  };

  // Determine status indicators
  const [jh,jm] = job.time.split(':').map(Number);
  const now      = new Date();
  const jobStart = new Date(job.date); jobStart.setHours(jh,jm,0,0);
  const isNow    = Math.abs(now-jobStart)<30*60000;
  const isLate   = now>new Date(jobStart.getTime()+15*60000) && !started;

  if(done && summary) return (
    <div className="card" style={{marginBottom:14,border:'2px solid #86efac'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <span style={{fontSize:28}}>✅</span>
        <div><p style={{fontWeight:800,fontSize:16,color:'#16a34a'}}>Job Complete!</p><p style={{fontSize:12,color:'#64748b'}}>{job.svc} — {job.clientName}</p></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[
          ['Scheduled start', job.time],
          ['Checked in',      summary.checkedIn],
          ['Completed at',    summary.completedAt],
          ['Total time',      `${summary.totalMins} min`],
          summary.minutesLate>0   ? ['Arrived',  `${summary.minutesLate} min late`,   '#dc2626'] : null,
          summary.minutesEarly>0  ? ['Finished', `${summary.minutesEarly} min early`,  '#16a34a'] : null,
          summary.minutesOverrun>0? ['Overran',  `${summary.minutesOverrun} min`,      '#f59e0b'] : null,
        ].filter(Boolean).map(([label,val,col])=>(
          <div key={label} style={{background:'#f8fafc',borderRadius:10,padding:'10px 12px'}}>
            <p style={{fontSize:10,color:'#94a3b8',fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>{label}</p>
            <p style={{fontWeight:700,fontSize:14,color:col||'#1f2937',marginTop:2}}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card" style={{marginBottom:14,border:isNow?'2px solid #2B3BB5':isLate?'2px solid #ef4444':'1px solid #e5e7eb'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
            <span style={{fontWeight:700,fontSize:16,color:'#1f2937'}}>{job.svc}</span>
            <Badge status={job.status}/>
            {isNow&&!started&&<span style={{background:'#dbeafe',color:'#1d4ed8',fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:999}}>🔵 Starting Now</span>}
            {isLate&&<span style={{background:'#fee2e2',color:'#dc2626',fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:999}}>🔴 Overdue</span>}
          </div>
          <div className="bk-meta">
            <span>🕐 {job.time}</span>
            <span>⏱ {job.dur} hr{job.dur>1?'s':''}</span>
            <span>💷 £{job.amount}</span>
          </div>
          {/* Phone & address only visible BEFORE job is complete */}
          {!done && (
            <>
              <p style={{fontSize:12,color:'#374151',marginTop:6,fontWeight:500}}>
                👤 {job.clientName}
                {job.clientPhone&&<> · 📞 <a href={`tel:${job.clientPhone}`} style={{color:'#2B3BB5',fontWeight:600}}>{job.clientPhone}</a></>}
              </p>
              <p style={{fontSize:12,color:'#374151',marginTop:3}}>📍 {job.address}, {job.area}</p>
              {job.notes&&<p style={{fontSize:12,color:'#64748b',marginTop:3}}>📝 {job.notes}</p>}
            </>
          )}
          {done && (
            <p style={{fontSize:12,color:'#94a3b8',marginTop:6,fontStyle:'italic'}}>Contact details hidden after job completion</p>
          )}
        </div>

        {/* Timer panel */}
        <div style={{
          textAlign:'center',
          background:started?'linear-gradient(135deg,#2B3BB5,#1a5fbb)':'#f1f5f9',
          borderRadius:16,padding:'14px 18px',minWidth:150,flexShrink:0,
          color:started?'#fff':'#1f2937',
        }}>
          <p style={{fontSize:10,opacity:.7,marginBottom:4,fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>
            {started?(paused?'Paused':'Live Timer'):'Job Timer'}
          </p>
          <p style={{fontSize:34,fontWeight:800,letterSpacing:2,lineHeight:1,fontFamily:"'Playfair Display',serif"}}>
            {fmt(secs)}
          </p>
          <p style={{fontSize:10,opacity:.6,marginTop:4}}>
            {started?(paused?'⏸ Paused':'● Recording'):'○ Not started'}
          </p>
          <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:6}}>
            {!started&&(
              <button onClick={checkIn} style={{background:'#2B3BB5',color:'#fff',border:'none',borderRadius:10,padding:'9px 14px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                ✓ Check In
              </button>
            )}
            {started&&!paused&&(
              <button onClick={pause} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'1px solid rgba(255,255,255,.35)',borderRadius:10,padding:'8px 14px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                ⏸ Pause
              </button>
            )}
            {started&&paused&&(
              <button onClick={resume} style={{background:'rgba(255,255,255,.2)',color:'#fff',border:'1px solid rgba(255,255,255,.35)',borderRadius:10,padding:'8px 14px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                ▶ Resume
              </button>
            )}
            {started&&(
              <button onClick={finish} style={{background:'#16a34a',color:'#fff',border:'none',borderRadius:10,padding:'8px 14px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                ■ Complete Job
              </button>
            )}
            {!started&&(
              <button onClick={()=>toast(`Notifying ${job.clientName}…`,'ok')} style={{background:'rgba(43,59,181,.08)',color:'#2B3BB5',border:'none',borderRadius:10,padding:'7px 10px',fontWeight:600,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>
                📍 Notify Client
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Upcoming ── */
function UpcomingTab({upcoming}) {
  return (
    <div style={{maxWidth:700}}>
      <div className="page-header"><div><h2 className="page-title">Upcoming Jobs</h2><p className="page-sub">Your scheduled assignments</p></div></div>
      {upcoming.length===0
        ?<div className="empty-state"><div className="empty-icon">📅</div><p className="empty-title">No upcoming jobs assigned yet</p></div>
        :upcoming.map(b=>(
          <div key={b.id} className="booking-card">
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                <span style={{fontWeight:700,fontSize:15}}>{b.svc}</span><Badge status={b.status}/>
              </div>
              <div className="bk-meta">
                <span>📅 {b.date}</span><span>🕐 {b.time}</span><span>⏱ {b.dur} hr{b.dur>1?'s':''}</span><span>👤 {b.clientName}</span>
              </div>
              {/* Show contact info for upcoming (not yet completed) */}
              <p style={{fontSize:12,color:'#374151',marginTop:4}}>
                📞 <a href={`tel:${b.clientPhone}`} style={{color:'#2B3BB5',fontWeight:600}}>{b.clientPhone}</a>
              </p>
              <p style={{fontSize:12,color:'#374151',marginTop:3}}>📍 {b.address}, {b.area}</p>
              {b.notes&&<p style={{fontSize:12,color:'#64748b',marginTop:3}}>📝 {b.notes}</p>}
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <p style={{fontWeight:800,fontSize:18,color:'#2B3BB5'}}>£{b.amount}</p>
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ── Earnings ── */
function EarningsTab({completed}) {
  const total = completed.reduce((s,b)=>s+b.amount,0);
  const monthKey = new Date().toISOString().slice(0,7);
  const thisMonth = completed.filter(b=>b.date?.slice(0,7)===monthKey);
  const monthTotal = thisMonth.reduce((s,b)=>s+b.amount,0);
  return (
    <div style={{maxWidth:600}}>
      <h2 className="page-title" style={{marginBottom:18}}>Earnings</h2>
      <div style={{background:'linear-gradient(135deg,#2B3BB5,#1a5fbb)',borderRadius:18,padding:'24px 28px',color:'#fff',marginBottom:18}}>
        <p style={{opacity:.7,fontSize:13,marginBottom:4}}>Available to withdraw</p>
        <p style={{fontSize:42,fontWeight:800,margin:'4px 0 16px',fontFamily:"'Playfair Display',serif"}}>£{total.toFixed(2)}</p>
        <button style={{background:'rgba(255,255,255,.2)',border:'1px solid rgba(255,255,255,.4)',color:'#fff',padding:'10px 20px',borderRadius:12,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>Withdraw Funds →</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:18}}>
        <Stat label="This Month" value={`£${monthTotal}`} sub={`${thisMonth.length} jobs`}/>
        <Stat label="All Time" value={`£${total}`} sub={`${completed.length} jobs`}/>
      </div>
      <div className="card">
        <h3 style={{fontWeight:700,fontSize:14,color:'#2B3BB5',marginBottom:14}}>Recent Payments</h3>
        {completed.length===0
          ?<p style={{color:'#94a3b8',fontSize:13}}>No completed jobs yet</p>
          :completed.slice(0,8).map(b=>(
            <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f1f5f9'}}>
              <div><p style={{fontWeight:600,fontSize:13}}>{b.svc}</p><p style={{fontSize:11,color:'#94a3b8'}}>{b.clientName} · {b.date}</p>
                {b.jobSummary&&<p style={{fontSize:10,color:'#64748b',marginTop:2}}>
                  {b.jobSummary.minutesLate>0&&<span style={{color:'#dc2626'}}>{b.jobSummary.minutesLate}min late · </span>}
                  {b.jobSummary.minutesEarly>0&&<span style={{color:'#16a34a'}}>{b.jobSummary.minutesEarly}min early · </span>}
                  {b.jobSummary.totalMins}min total
                </p>}
              </div>
              <span style={{fontWeight:700,color:'#16a34a',fontSize:14}}>+£{b.amount}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ── Comms ── */
function CommsTab({myJobs,toast}) {
  const [msgs,setMsgs] = useState([
    {from:'client',text:'Hi, are you on your way?',time:'09:45'},
    {from:'pro',text:'Yes, about 10 minutes away!',time:'09:46'},
  ]);
  const [input,setInput] = useState('');
  const chatRef = useRef(null);
  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[msgs]);
  const send = () => {
    if(!input.trim()) return;
    setMsgs(m=>[...m,{from:'pro',text:input,time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}]);
    setInput('');
  };
  const clients = [...new Set(myJobs.filter(j=>!['Completed','Cancelled'].includes(j.status)).map(j=>j.clientName))].filter(Boolean);
  const presets = [
    {e:'🕐',t:"Running 10–15 mins late, on my way!"},
    {e:'📍',t:"Arrived at your address, please let me in."},
    {e:'✅',t:"Job complete! Please review and rate."},
    {e:'📅',t:"Need to reschedule — please contact support."},
  ];
  return (
    <div style={{maxWidth:600}}>
      <h2 className="page-title" style={{marginBottom:16}}>Communications</h2>
      <div className="card" style={{marginBottom:14}}>
        <h3 style={{fontWeight:700,fontSize:14,color:'#2B3BB5',marginBottom:12}}>Active Clients</h3>
        {clients.length===0?<p style={{color:'#94a3b8',fontSize:13}}>No active clients</p>:clients.map(c=>(
          <div key={c} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f1f5f9'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div className="user-av" style={{width:30,height:30,fontSize:11}}>{c.split(' ').map(x=>x[0]).join('')}</div>
              <span style={{fontWeight:500,fontSize:14}}>{c}</span>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>toast(`Calling ${c}…`,'ok')} className="btn-sm-outline">📞 Call</button>
              <button onClick={()=>toast(`SMS sent to ${c}!`,'ok')} className="btn-sm-green">💬 Text</button>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{marginBottom:14}}>
        <h3 style={{fontWeight:700,fontSize:14,color:'#2B3BB5',marginBottom:10}}>Quick Messages</h3>
        {presets.map(p=>(
          <button key={p.t} onClick={()=>{setMsgs(m=>[...m,{from:'pro',text:p.t,time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}]);toast('Message sent!','ok');}}
            style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'10px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,background:'#fff',fontSize:13,cursor:'pointer',marginBottom:7,textAlign:'left',fontFamily:'inherit',transition:'all .15s'}}
            onMouseOver={e=>{e.currentTarget.style.borderColor='#2B3BB5';e.currentTarget.style.background='#eff6ff';}}
            onMouseOut={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.background='#fff';}}>
            <span>{p.e}</span>{p.t}
          </button>
        ))}
      </div>
      <div className="card">
        <h3 style={{fontWeight:700,fontSize:14,color:'#2B3BB5',marginBottom:10}}>Chat</h3>
        <div ref={chatRef} style={{height:180,overflowY:'auto',marginBottom:10,display:'flex',flexDirection:'column',gap:6}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignSelf:m.from==='pro'?'flex-end':'flex-start',maxWidth:'76%'}}>
              <div style={{padding:'9px 14px',borderRadius:m.from==='pro'?'14px 14px 4px 14px':'14px 14px 14px 4px',background:m.from==='pro'?'#2B3BB5':'#f1f5f9',color:m.from==='pro'?'#fff':'#1f2937',fontSize:13}}>{m.text}</div>
              <span style={{fontSize:10,color:'#94a3b8',marginTop:2,alignSelf:m.from==='pro'?'flex-end':'flex-start'}}>{m.time}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8}}>
          <input className="form-input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message…" onKeyDown={e=>e.key==='Enter'&&send()} style={{flex:1}}/>
          <button onClick={send} className="btn-primary" style={{padding:'10px 18px',borderRadius:10}}>Send</button>
        </div>
      </div>
    </div>
  );
}

/* ── Pro Profile ── */
function ProProfile() {
  const {user,pros,updatePro,toast,setModal} = useApp();
  const pro = pros.find(p=>p.id===user?.id)||user;
  const [f,setF] = useState({name:pro?.name||'',email:pro?.email||'',phone:pro?.phone||'',address:pro?.address||'',area:pro?.area||'',cleaning_preference:pro?.cleaning_preference||'',password:'',confirmPw:''});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  const save = () => {
    if(f.password&&f.password!==f.confirmPw){toast('Passwords do not match','err');return;}
    if(f.password&&f.password.length<6){toast('Password must be at least 6 characters','err');return;}
    const patch={name:f.name,email:f.email,phone:f.phone,address:f.address,area:f.area,cleaning_preference:f.cleaning_preference};
    if(f.password) patch.password=f.password;
    updatePro(user?.id,patch);
    setF(p=>({...p,password:'',confirmPw:''}));
  };
  return (
    <div style={{maxWidth:520}}>
      <h2 className="page-title" style={{marginBottom:18}}>My Profile</h2>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
          <div className="user-av-lg" style={{background:'#2B3BB5'}}>{user?.name?.[0]}{user?.name?.split(' ')[1]?.[0]}</div>
          <div><p style={{fontWeight:700,fontSize:16}}>{user?.name}</p><p style={{fontSize:12,color:'#64748b'}}>Chores Pro · ⭐ {user?.rating} · {user?.jobsDone} jobs</p></div>
        </div>
        <div className="form-row-2">
          <div className="form-group"><label className="form-label">Full name</label><input className="form-input" value={f.name} onChange={up('name')}/></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={f.email} onChange={up('email')}/></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={f.phone} onChange={up('phone')}/></div>
          <div className="form-group"><label className="form-label">Area</label><input className="form-input" value={f.area} onChange={up('area')}/></div>
          <div className="form-group"><label className="form-label">Cleaning preference</label><input className="form-input" value={f.cleaning_preference} onChange={up('cleaning_preference')}/></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={f.address} onChange={up('address')}/></div>
        <div style={{borderTop:'1px solid #f1f5f9',paddingTop:16,marginTop:4}}>
          <p style={{fontWeight:600,fontSize:13,color:'#374151',marginBottom:10}}>Change Password</p>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">New password</label><input className="form-input" type="password" value={f.password} onChange={up('password')} placeholder="Leave blank to keep current"/></div>
            <div className="form-group"><label className="form-label">Confirm password</label><input className="form-input" type="password" value={f.confirmPw} onChange={up('confirmPw')}/></div>
          </div>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:8}}>
          <button onClick={save} className="btn-primary">Save Changes</button>
          <button onClick={()=>setModal('tc-pro')} className="btn-sm-gray">Terms & Conditions</button>
          <button onClick={()=>setModal('privacy')} className="btn-sm-gray">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
}
