import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function Badge({status}){
  const m={Pending:'background:#fef3c7;color:#92400e',Confirmed:'background:#dbeafe;color:#1d4ed8','In progress':'background:#dbeafe;color:#2B3BB5',Completed:'background:#dcfce7;color:#15803d',Cancelled:'background:#fee2e2;color:#dc2626',Active:'background:#dcfce7;color:#15803d',Paid:'background:#dcfce7;color:#15803d',Inactive:'background:#f1f5f9;color:#64748b'};
  const style=Object.fromEntries((m[status]||'background:#f1f5f9;color:#64748b').split(';').map(s=>s.trim().split(':')));
  return <span style={{display:'inline-flex',alignItems:'center',padding:'3px 10px',borderRadius:999,fontSize:11,fontWeight:700,...style}}>{status}</span>;
}

export function Modal({id,children,maxW='500px'}){
  const {modal,setModal}=useApp();
  const isOpen=Array.isArray(id)?id.includes(modal):modal===id;
  useEffect(()=>{document.body.style.overflow=isOpen?'hidden':'';return()=>{document.body.style.overflow='';};},[isOpen]);
  if(!isOpen) return null;
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
      <div className="modal-box" style={{maxWidth:maxW}}>
        <button onClick={()=>setModal(null)} className="modal-close">✕</button>
        {children}
      </div>
    </div>
  );
}

export function ToastContainer(){
  const {toasts}=useApp();
  return(
    <div style={{position:'fixed',top:76,right:16,zIndex:9999,display:'flex',flexDirection:'column',gap:8,pointerEvents:'none'}}>
      {toasts.map(t=><div key={t.id} className={`toast toast-${t.type}`}>{t.type==='ok'?'✅':t.type==='err'?'❌':'ℹ️'} {t.msg}</div>)}
    </div>
  );
}

export function Stat({label,value,sub,color='#2B3BB5'}){
  return(
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={{color}}>{value}</p>
      {sub&&<p className="stat-sub">{sub}</p>}
    </div>
  );
}

export function TCBox({html}){
  return <div className="tc-box" dangerouslySetInnerHTML={{__html:html}}/>;
}
