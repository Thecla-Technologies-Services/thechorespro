import { useState } from 'react';
import { useApp, isValidEmail } from '../context/AppContext';
import { Modal, TCBox } from './UI';
import LOGO from '../data/logo';
import { SERVICES, AREAS, TC_CLIENT, TC_PRO, PRIVACY } from '../data/constants';

export function LoginModal() {
  const { login, setModal } = useApp();
  const [tab, setTab]     = useState('client');
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [err, setErr]     = useState('');
  const [loading, setLoading] = useState(false);
  const DEMOS = { client:'sarah@email.com', pro:'john@email.com', admin:'thecla90@gmail.com' };

  const doLogin = () => {
    setErr('');
    if (!email.trim()) { setErr('Please enter your email.'); return; }
    if (!isValidEmail(email)) { setErr('Please enter a valid email address.'); return; }
    if (!pw) { setErr('Please enter your password.'); return; }
    setLoading(true);
    setTimeout(() => {
      const res = login(email.trim(), pw, tab);
      setLoading(false);
      if (!res.ok) setErr(res.msg);
    }, 350);
  };

  return (
    <Modal id="login" maxW="420px">
      <div className="modal-body">
        <div style={{textAlign:'center',marginBottom:20}}>
          <img src={LOGO} alt="The Chores" style={{height:46,objectFit:'contain',margin:'0 auto 12px',display:'block'}} />
          <h2 className="modal-title">Sign In</h2>
          <p className="modal-sub">Welcome back to The Chores</p>
        </div>
        <div className="tab-row">
          {[{id:'client',label:'Customer'},{id:'pro',label:'Chores Pro'},{id:'admin',label:'Admin'}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setEmail(DEMOS[t.id]);setErr('');}}
              className={`tab-btn${tab===t.id?' active':''}`}>{t.label}</button>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" value={email}
            onChange={e=>{setEmail(e.target.value);setErr('');}} placeholder="your@email.com"
            onKeyDown={e=>e.key==='Enter'&&doLogin()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={pw}
            onChange={e=>{setPw(e.target.value);setErr('');}} placeholder="Your password"
            onKeyDown={e=>e.key==='Enter'&&doLogin()} />
        </div>
        {err && <div className="form-err-box">⚠️ {err}</div>}
        <button onClick={doLogin} disabled={loading} className="btn-primary w-full" style={{marginTop:10,padding:14,fontSize:15}}>
          {loading?'Signing in…':'Sign In →'}
        </button>
        <p style={{textAlign:'center',fontSize:11,color:'#94a3b8',marginTop:10}}>
          Demo — Customer: <strong>sarah@email.com</strong> / pass123
        </p>
        {tab!=='admin'&&(
          <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginTop:12}}>
            No account? <button onClick={()=>setModal(tab==='pro'?'signup-pro':'signup-client')} className="link-btn">Sign up free →</button>
          </p>
        )}
      </div>
    </Modal>
  );
}

export function SignupClientModal() {
  const { clientSignup, setModal } = useApp();
  const [f, setF] = useState({name:'',email:'',phone:'',password:'',confirm:'',address:'',area:''});
  const [tc, setTc] = useState(false);
  const [err, setErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const up = k => e => { setF(p=>({...p,[k]:e.target.value})); setErr(''); if(k==='email') setEmailErr(''); };
  const checkEmail = () => { if(f.email&&!isValidEmail(f.email)) setEmailErr('Please enter a valid email (e.g. name@example.com)'); else setEmailErr(''); };
  const submit = () => {
    setErr('');
    if(!f.name.trim()){setErr('Full name is required.');return;}
    if(!isValidEmail(f.email)){setErr('A valid email address is required.');return;}
    if(!f.phone.trim()){setErr('Phone number is required.');return;}
    if(!f.area){setErr('Please select your area.');return;}
    if(f.password.length<6){setErr('Password must be at least 6 characters.');return;}
    if(f.password!==f.confirm){setErr('Passwords do not match.');return;}
    if(!tc){setErr('You must accept the Terms & Conditions to continue.');return;}
    const res = clientSignup(f);
    if(!res.ok) setErr(res.msg);
  };
  return (
    <Modal id="signup-client" maxW="500px">
      <div className="modal-body">
        <div style={{textAlign:'center',marginBottom:16}}>
          <img src={LOGO} alt="" style={{height:42,objectFit:'contain',margin:'0 auto 10px',display:'block'}} />
          <h2 className="modal-title">Create Your Account</h2>
          <p className="modal-sub">Book professional cleaning services today</p>
        </div>
        <div className="form-row-2">
          <div className="form-group"><label className="form-label">Full name <span className="req">*</span></label><input className="form-input" value={f.name} onChange={up('name')} placeholder="Sarah Clarke"/></div>
          <div className="form-group">
            <label className="form-label">Email address <span className="req">*</span></label>
            <input className={`form-input${emailErr?' input-err':''}`} type="email" value={f.email} onChange={up('email')} onBlur={checkEmail} placeholder="your@email.com"/>
            {emailErr&&<p className="field-err">{emailErr}</p>}
          </div>
          <div className="form-group"><label className="form-label">Phone <span className="req">*</span></label><input className="form-input" value={f.phone} onChange={up('phone')} placeholder="+44 7700 900000"/></div>
          <div className="form-group"><label className="form-label">Area <span className="req">*</span></label>
            <select className="form-input" value={f.area} onChange={up('area')}><option value="">Select your area</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select>
          </div>
          <div className="form-group"><label className="form-label">Password <span className="req">*</span></label><input className="form-input" type="password" value={f.password} onChange={up('password')} placeholder="Min 6 characters"/></div>
          <div className="form-group"><label className="form-label">Confirm password <span className="req">*</span></label><input className="form-input" type="password" value={f.confirm} onChange={up('confirm')} placeholder="Repeat password"/></div>
        </div>
        <div className="form-group"><label className="form-label">Address (optional)</label><input className="form-input" value={f.address} onChange={up('address')} placeholder="Your home address"/></div>
        <TCBox html={TC_CLIENT.split('<h4>').slice(0,3).map((s,i)=>i?'<h4>'+s:'').join('')} />
        <label className="chk-label">
          <input type="checkbox" checked={tc} onChange={e=>setTc(e.target.checked)}/>
          I agree to the <button onClick={()=>setModal('tc-client')} className="link-btn">Terms & Conditions</button> and <button onClick={()=>setModal('privacy')} className="link-btn">Privacy Policy</button><span className="req"> *</span>
        </label>
        {err&&<div className="form-err-box" style={{marginTop:8}}>⚠️ {err}</div>}
        <button onClick={submit} className="btn-primary w-full" style={{marginTop:14,padding:14,fontSize:15}}>Create Account →</button>
        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginTop:12}}>Already have an account? <button onClick={()=>setModal('login')} className="link-btn">Sign in</button></p>
      </div>
    </Modal>
  );
}

export function SignupProModal() {
  const { proSignup, setModal } = useApp();
  const [f, setF] = useState({name:'',email:'',phone:'',password:'',address:'',area:'',cleaning_preference:''});
  const [svcs, setSvcs] = useState([]);
  const [tc, setTc] = useState(false);
  const [bg, setBg] = useState(false);
  const [err, setErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const up = k => e => { setF(p=>({...p,[k]:e.target.value})); setErr(''); if(k==='email') setEmailErr(''); };
  const checkEmail = () => { if(f.email&&!isValidEmail(f.email)) setEmailErr('Please enter a valid email (e.g. name@example.com)'); else setEmailErr(''); };
  const toggleSvc = s => setSvcs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const submit = () => {
    setErr('');
    if(!f.name.trim()){setErr('Full name is required.');return;}
    if(!isValidEmail(f.email)){setErr('A valid email address is required.');return;}
    if(!f.phone.trim()){setErr('Phone number is required.');return;}
    if(!f.area){setErr('Please select your area.');return;}
    if(!f.cleaning_preference){setErr('Please select your cleaning preference.');return;}
    if(svcs.length===0){setErr('Please select at least one service.');return;}
    if(f.password.length<6){setErr('Password must be at least 6 characters.');return;}
    if(!tc||!bg){setErr('You must accept both agreements to proceed.');return;}
    const res = proSignup({...f,services:svcs});
    if(!res.ok) setErr(res.msg);
  };
  return (
    <Modal id="signup-pro" maxW="520px">
      <div className="modal-body">
        <div style={{textAlign:'center',marginBottom:16}}>
          <img src={LOGO} alt="" style={{height:42,objectFit:'contain',margin:'0 auto 10px',display:'block'}} />
          <h2 className="modal-title">Join as a Chores Pro</h2>
          <p className="modal-sub">Earn flexibly doing what you're great at</p>
        </div>
        <div className="form-row-2">
          <div className="form-group"><label className="form-label">Full name <span className="req">*</span></label><input className="form-input" value={f.name} onChange={up('name')} placeholder="John Adeyemi"/></div>
          <div className="form-group">
            <label className="form-label">Email address <span className="req">*</span></label>
            <input className={`form-input${emailErr?' input-err':''}`} type="email" value={f.email} onChange={up('email')} onBlur={checkEmail} placeholder="your@email.com"/>
            {emailErr&&<p className="field-err">{emailErr}</p>}
          </div>
          <div className="form-group"><label className="form-label">Phone <span className="req">*</span></label><input className="form-input" value={f.phone} onChange={up('phone')} placeholder="+44 7700 000000"/></div>
          <div className="form-group"><label className="form-label">Area <span className="req">*</span></label>
            <select className="form-input" value={f.area} onChange={up('area')}><option value="">Select area</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select>
          </div>
          <div className="form-group"><label className="form-label">Cleaning preference <span className="req">*</span></label>
            <select className="form-input" value={f.cleaning_preference} onChange={up('cleaning_preference')}><option value="">Select</option><option>Residential</option><option>Commercial</option><option>Both</option></select>
          </div>
          <div className="form-group"><label className="form-label">Password <span className="req">*</span></label><input className="form-input" type="password" value={f.password} onChange={up('password')} placeholder="Min 6 characters"/></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={f.address} onChange={up('address')} placeholder="Your address"/></div>
        <div className="form-group">
          <label className="form-label">Services you offer <span className="req">*</span></label>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:6}}>
            {SERVICES.map(s=><button key={s.id} type="button" onClick={()=>toggleSvc(s.name)} className={`svc-chip${svcs.includes(s.name)?' active':''}`}>{s.icon} {s.name}</button>)}
          </div>
        </div>
        <TCBox html={TC_PRO.split('<h4>').slice(0,3).map((s,i)=>i?'<h4>'+s:'').join('')} />
        <label className="chk-label" style={{marginBottom:8}}>
          <input type="checkbox" checked={tc} onChange={e=>setTc(e.target.checked)}/>
          I agree to the <button onClick={()=>setModal('tc-pro')} className="link-btn">Pro Terms & Conditions</button> and <button onClick={()=>setModal('privacy')} className="link-btn">Privacy Policy</button><span className="req"> *</span>
        </label>
        <label className="chk-label">
          <input type="checkbox" checked={bg} onChange={e=>setBg(e.target.checked)}/>
          I consent to background verification before activation<span className="req"> *</span>
        </label>
        {err&&<div className="form-err-box" style={{marginTop:8}}>⚠️ {err}</div>}
        <button onClick={submit} className="btn-primary w-full" style={{marginTop:14,padding:14,fontSize:15}}>Apply to Join →</button>
        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginTop:10}}>Already a Pro? <button onClick={()=>setModal('login')} className="link-btn">Sign in</button></p>
      </div>
    </Modal>
  );
}

export function BookingModal() {
  const { modal, user, addBooking, setModal } = useApp();
  const [step, setStep] = useState(1);
  const [svc, setSvc]   = useState(null);
  const [f, setF]       = useState({date:'',time:'09:00',dur:2,address:user?.address||'',area:user?.area||'',notes:''});
  const [tc, setTc]     = useState(false);
  const [err, setErr]   = useState('');
  const today = new Date().toISOString().split('T')[0];
  const up    = k => e => setF(p=>({...p,[k]:e.target.value}));
  const total = svc ? svc.rate * f.dur : 0;
  const confirm = () => {
    if(!tc){setErr('Please accept the Terms & Conditions to proceed.');return;}
    const id='BK-'+String(Date.now()).slice(-6);
    addBooking({id,clientName:user?.name||'Guest',clientEmail:user?.email||'',clientPhone:user?.phone||'',
      address:f.address,area:f.area,svc:svc.name,svcId:svc.id,date:f.date,time:f.time,
      dur:Number(f.dur),amount:total,notes:f.notes,status:'Pending',payment:'Pending',
      paymentDate:'',pro:'',proEmail:'',createdAt:today,rating:null,comment:''});
    setStep(1);setSvc(null);setF({date:'',time:'09:00',dur:2,address:'',area:'',notes:''});setTc(false);setErr('');
  };
  if(modal!=='booking') return null;
  return (
    <Modal id="booking" maxW="540px">
      <div className="modal-body">
        <h2 className="modal-title">Book a Service</h2>
        <p className="modal-sub" style={{marginBottom:20}}>Professional cleaning at your convenience</p>
        <div className="steps-row">
          {['Choose Service','Schedule','Confirm'].map((label,i)=>{
            const n=i+1;
            return(<div key={n} className="step-wrap">
              <div className={`step-num${step===n?' active':step>n?' done':''}`}>{step>n?'✓':n}</div>
              {i<2&&<div className={`step-line${step>n?' done':''}`}/>}
              <span className={`step-label${step===n?' active':''}`}>{label}</span>
            </div>);
          })}
        </div>
        {step===1&&(<>
          <div className="svc-grid">{SERVICES.map(s=><button key={s.id} onClick={()=>setSvc(s)} className={`svc-tile${svc?.id===s.id?' selected':''}`}><div className="svc-tile-icon">{s.icon}</div><div className="svc-tile-name">{s.name}</div><div className="svc-tile-price">£{s.rate}/hr</div></button>)}</div>
          <div className="form-group" style={{marginTop:12}}><label className="form-label">Special instructions (optional)</label><textarea className="form-input" rows={2} value={f.notes} onChange={up('notes')} placeholder="Access codes, allergies, areas to focus on…"/></div>
          <button disabled={!svc} onClick={()=>setStep(2)} className="btn-primary w-full" style={{marginTop:4,padding:13,opacity:svc?1:.4}}>Next: Schedule →</button>
        </>)}
        {step===2&&(<>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">Date <span className="req">*</span></label><input type="date" className="form-input" min={today} value={f.date} onChange={up('date')}/></div>
            <div className="form-group"><label className="form-label">Start time</label><input type="time" className="form-input" value={f.time} onChange={up('time')}/></div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration: <strong>{f.dur} hr{f.dur>1?'s':''}</strong></label>
            <input type="range" min="1" max="8" value={f.dur} onChange={e=>setF(p=>({...p,dur:+e.target.value}))} style={{width:'100%',accentColor:'#2B3BB5',marginTop:6}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#94a3b8',marginTop:2}}><span>1 hr</span><span>8 hrs</span></div>
          </div>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">Service address <span className="req">*</span></label><input className="form-input" value={f.address} onChange={up('address')} placeholder="Full address"/></div>
            <div className="form-group"><label className="form-label">Area <span className="req">*</span></label><select className="form-input" value={f.area} onChange={up('area')}><option value="">Select area</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
          </div>
          <div className="cost-preview">
            <span style={{fontSize:12,color:'#64748b'}}>Estimated total</span>
            <span style={{fontSize:28,fontWeight:800,color:'#2B3BB5'}}>£{total.toFixed(2)}</span>
            <span style={{fontSize:11,color:'#94a3b8'}}>£{svc?.rate}/hr × {f.dur} hr{f.dur>1?'s':''}</span>
          </div>
          <div style={{display:'flex',gap:10,marginTop:14}}>
            <button onClick={()=>setStep(1)} className="btn-outline">← Back</button>
            <button disabled={!f.date||!f.address||!f.area} onClick={()=>setStep(3)} className="btn-primary" style={{flex:1,opacity:f.date&&f.address&&f.area?1:.4}}>Review & Confirm →</button>
          </div>
        </>)}
        {step===3&&(<>
          <div className="summary-box">
            <h3 style={{fontWeight:700,color:'#1b5e20',marginBottom:14,fontSize:15}}>Booking Summary</h3>
            <table style={{width:'100%',fontSize:13}}><tbody>
              {[['Service',svc?.name],['Date',f.date],['Time',f.time],['Duration',`${f.dur} hr${f.dur>1?'s':''}`],['Address',f.address],['Area',f.area]].map(([k,v])=>(
                <tr key={k}><td style={{color:'#64748b',padding:'4px 0',width:'35%'}}>{k}</td><td style={{fontWeight:600}}>{v}</td></tr>
              ))}
              <tr style={{borderTop:'2px solid #c8e6c9'}}><td style={{padding:'10px 0',fontWeight:700,fontSize:15}}>Total</td><td style={{fontWeight:800,color:'#2B3BB5',fontSize:18}}>£{total.toFixed(2)}</td></tr>
            </tbody></table>
          </div>
          <div className="info-box" style={{marginTop:12}}><span>📧</span><p style={{fontSize:13,color:'#1b5e20'}}><strong>A payment link will be sent to your email</strong> once your booking is confirmed.</p></div>
          <TCBox html={TC_CLIENT.split('<h4>').slice(0,3).map((s,i)=>i?'<h4>'+s:'').join('')} />
          <label className="chk-label" style={{marginTop:8}}>
            <input type="checkbox" checked={tc} onChange={e=>setTc(e.target.checked)}/>
            I accept the <button onClick={()=>setModal('tc-client')} className="link-btn">Terms & Conditions</button> and <button onClick={()=>setModal('privacy')} className="link-btn">Privacy Policy</button><span className="req"> *</span>
          </label>
          {err&&<div className="form-err-box" style={{marginTop:8}}>⚠️ {err}</div>}
          <div style={{display:'flex',gap:10,marginTop:14}}>
            <button onClick={()=>setStep(2)} className="btn-outline">← Back</button>
            <button onClick={confirm} className="btn-primary" style={{flex:1,padding:13}}>✓ Confirm Booking</button>
          </div>
        </>)}
      </div>
    </Modal>
  );
}

export function TCClientModal() {
  const {setModal}=useApp();
  return(<Modal id="tc-client" maxW="580px"><div className="modal-body"><h2 className="modal-title">Customer Terms & Conditions</h2><p className="modal-sub">The Chores · June 2026</p><div className="tc-box-full" dangerouslySetInnerHTML={{__html:TC_CLIENT}}/><button onClick={()=>setModal(null)} className="btn-primary w-full" style={{marginTop:16}}>I understand — Close</button></div></Modal>);
}
export function TCProModal() {
  const {setModal}=useApp();
  return(<Modal id="tc-pro" maxW="580px"><div className="modal-body"><h2 className="modal-title">Chores Pro Terms & Conditions</h2><p className="modal-sub">The Chores · June 2026</p><div className="tc-box-full" dangerouslySetInnerHTML={{__html:TC_PRO}}/><button onClick={()=>setModal(null)} className="btn-primary w-full" style={{marginTop:16}}>I understand — Close</button></div></Modal>);
}
export function PrivacyModal() {
  const {setModal}=useApp();
  return(<Modal id="privacy" maxW="580px"><div className="modal-body"><h2 className="modal-title">Privacy Policy</h2><p className="modal-sub">Thecla Business Solutions · June 2026</p><div className="tc-box-full" dangerouslySetInnerHTML={{__html:PRIVACY}}/><button onClick={()=>setModal(null)} className="btn-primary w-full" style={{marginTop:16}}>Close</button></div></Modal>);
}
