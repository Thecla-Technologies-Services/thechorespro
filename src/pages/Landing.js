import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import LOGO from '../data/logo';
import { SERVICES } from '../data/constants';

const SLIDES = [
  { heading:<>Professional Cleaning.<br/><em>On Demand.</em></>, sub:'Book a vetted cleaning professional in under 60 seconds. Background-checked, insured, and ready for you.', img:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&auto=format&fit=crop&q=80' },
  { heading:<>Spotless Offices.<br/><em>Every Morning.</em></>, sub:'From daily office maintenance to post-renovation deep cleans — we keep your workspace immaculate.', img:'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1400&auto=format&fit=crop&q=80' },
  { heading:<>Hotels & Schools.<br/><em>Always Pristine.</em></>, sub:'Specialist cleaning for every commercial space — hotels, schools, and everything in between.', img:'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1400&auto=format&fit=crop&q=80' },
  { heading:<>Earn Flexibly.<br/><em>Work Your Way.</em></>, sub:'Are you a cleaning professional? Join The Chores and connect with clients who need your skills today.', img:'https://images.unsplash.com/photo-1527515545081-5db817172677?w=1400&auto=format&fit=crop&q=80' },
];

const STATS  = [{v:'500+',l:'Happy Customers'},{v:'98%',l:'Satisfaction Rate'},{v:'50+',l:'Vetted Pros'},{v:'1,200+',l:'Jobs Completed'}];
const FEATS  = [
  {i:'🔒',t:'Vetted & Verified',d:'Every Pro is background-checked, insured, and personally vetted before their first booking.'},
  {i:'⚡',t:'Book in Minutes',d:'Choose your service, pick a slot, confirm — takes under 60 seconds.'},
  {i:'💳',t:'Secure Payments',d:'Payment links sent by email. Funds held securely in escrow until you confirm the job is done.'},
  {i:'⭐',t:'Rate Every Job',d:'Leave a rating and comment after every completed booking to help maintain quality.'},
  {i:'📱',t:'Real-Time Updates',d:'Get notified when your Pro is on the way, checks in, and completes the job.'},
  {i:'🤝',t:'Dedicated Support',d:'Our team responds to every support ticket, every day — no bots, real people.'},
];
const SERVE  = [
  {i:'🏠',t:'Residential Homes',items:['Standard weekly cleans','Deep cleans','End-of-tenancy','Laundry & ironing','Cooking & errands']},
  {i:'🏢',t:'Commercial Offices',items:['Daily office cleaning','Post-renovation','Washroom & pantry','Disinfection services','Flexible scheduling']},
  {i:'🏨',t:'Hotels & Hospitality',items:['Room turnovers','Linen & laundry','Public area cleaning','Event preparation','Ongoing maintenance']},
  {i:'🏫',t:'Schools & Institutions',items:['Classroom cleaning','Washroom sanitisation','Common area maintenance','Term & holiday cleans','Safe & certified']},
];
const HOW = [
  {n:'01',i:'📝',t:'Book Online',d:'Choose your service, date, time and address in minutes. No phone calls needed.'},
  {n:'02',i:'📧',t:'Receive Payment Link',d:'After booking, a secure payment link is sent to your email. Pay at your convenience.'},
  {n:'03',i:'✨',t:'Pro Shows Up',d:'Your vetted Chores Pro arrives on time and gets to work — you get real-time updates.'},
  {n:'04',i:'⭐',t:'Rate & Review',d:'Confirm completion, leave a rating and comment, and enjoy your spotless space!'},
];

export default function Landing() {
  const {setModal,user,setScreen} = useApp();
  const [slide,setSlide]   = useState(0);
  const [menuOpen,setMenu] = useState(false);

  useEffect(()=>{ const t=setInterval(()=>setSlide(s=>(s+1)%SLIDES.length),5000); return()=>clearInterval(t); },[]);

  const bookNow = () => { if(!user||user.role!=='client'){setModal('login');}else{setModal('booking');} };
  const scroll  = id => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMenu(false); };

  return (
    <div style={{minHeight:'100vh',fontFamily:"'Inter',sans-serif",color:'#1f2937'}}>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.97)',backdropFilter:'blur(12px)',borderBottom:'1px solid #e5e7eb',padding:'0 5%'}}>
        <div style={{maxWidth:1200,margin:'0 auto',height:66,display:'flex',alignItems:'center',gap:20}}>
          <img src={LOGO} alt="The Chores" style={{height:38,objectFit:'contain',cursor:'pointer'}} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}/>
          <div style={{display:'flex',alignItems:'center',gap:4,flex:1}} className="nav-links-wrap">
            {['about','services','how-it-works','team','book'].map(id=>(
              <button key={id} onClick={()=>scroll(id)} style={{background:'none',border:'none',fontSize:14,fontWeight:500,color:'#374151',cursor:'pointer',padding:'8px 12px',borderRadius:8,fontFamily:'inherit',textTransform:'capitalize',transition:'all .15s'}}
                onMouseOver={e=>{e.target.style.background='#f1f5f9';e.target.style.color='#2B3BB5';}}
                onMouseOut={e=>{e.target.style.background='none';e.target.style.color='#374151';}}>
                {id.replace('-',' ')}
              </button>
            ))}
          </div>
          <button className="hamburger" onClick={()=>setMenu(m=>!m)}><span/><span/><span/></button>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {user
              ? <button onClick={()=>setScreen(user.role)} className="btn-primary" style={{padding:'9px 18px',borderRadius:10,fontSize:14}}>Dashboard →</button>
              : <>
                  <button onClick={()=>setModal('login')} className="btn-outline" style={{padding:'9px 18px',borderRadius:10,fontSize:14}}>Log In</button>
                  <button onClick={()=>setModal('signup-client')} className="btn-primary" style={{padding:'9px 18px',borderRadius:10,fontSize:14}}>Get Started</button>
                </>
            }
          </div>
        </div>
        {menuOpen&&(
          <div style={{background:'#fff',borderTop:'1px solid #e5e7eb',padding:'12px 5%',display:'flex',flexDirection:'column',gap:4}}>
            {['about','services','how-it-works','team','book'].map(id=>(
              <button key={id} onClick={()=>scroll(id)} style={{background:'none',border:'none',fontSize:14,color:'#374151',cursor:'pointer',padding:'10px 0',textAlign:'left',fontFamily:'inherit',textTransform:'capitalize'}}>
                {id.replace('-',' ')}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{position:'relative',minHeight:'90vh',display:'flex',alignItems:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(${SLIDES[slide].img})`,backgroundSize:'cover',backgroundPosition:'center',transition:'opacity .8s',filter:'brightness(.38)'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(43,59,181,.75) 0%,rgba(26,95,187,.6) 100%)'}}/>
<<<<<<< HEAD
        <div className="hero-inner" style={{position:'relative',zIndex:2}}>
=======
        <div style={{position:'relative',zIndex:2,maxWidth:1200,margin:'0 auto',padding:'80px 5%',width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
>>>>>>> abe6c28b9c96175c718e0398f2d1d590f37919a8
          <div>
            <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
              <span style={{display:'inline-block',background:'rgba(255,255,255,.18)',border:'1px solid rgba(255,255,255,.35)',color:'#fff',fontSize:12,fontWeight:700,padding:'5px 14px',borderRadius:999,letterSpacing:1,textTransform:'uppercase'}}>🌟 Trusted · Vetted · Professional</span>
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(36px,4.5vw,58px)',lineHeight:1.08,color:'#fff',marginBottom:18,fontWeight:700}}>
              {SLIDES[slide].heading}
            </h1>
            <p style={{fontSize:17,color:'rgba(255,255,255,.88)',lineHeight:1.7,marginBottom:28,maxWidth:460}}>{SLIDES[slide].sub}</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:28}}>
              <button onClick={bookNow} style={{background:'#fff',color:'#2B3BB5',fontWeight:800,border:'none',padding:'14px 30px',borderRadius:50,fontSize:15,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 6px 24px rgba(0,0,0,.18)',transition:'all .15s'}}
                onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseOut={e=>e.currentTarget.style.transform='none'}>
                📅 Book Now
              </button>
              <button onClick={()=>setModal('signup-pro')} style={{background:'transparent',color:'#fff',fontWeight:700,border:'2px solid rgba(255,255,255,.65)',padding:'12px 26px',borderRadius:50,fontSize:15,cursor:'pointer',fontFamily:'inherit',transition:'all .15s'}}
                onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}
                onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                ✨ Join as Pro
              </button>
            </div>
            <div style={{display:'flex',gap:8}}>
              {SLIDES.map((_,i)=>(
                <button key={i} onClick={()=>setSlide(i)} style={{height:6,borderRadius:3,background:i===slide?'#fff':'rgba(255,255,255,.35)',border:'none',cursor:'pointer',transition:'all .3s',padding:0,width:i===slide?24:6}}/>
              ))}
            </div>
          </div>
<<<<<<< HEAD
          <div className="hero-stats-grid">
=======
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
>>>>>>> abe6c28b9c96175c718e0398f2d1d590f37919a8
            {STATS.map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,.14)',border:'1px solid rgba(255,255,255,.25)',backdropFilter:'blur(8px)',borderRadius:16,padding:'20px 22px',textAlign:'center'}}>
                <p style={{fontSize:34,fontWeight:800,color:'#fff',lineHeight:1,marginBottom:6}}>{s.v}</p>
                <p style={{fontSize:12,color:'rgba(255,255,255,.7)',fontWeight:600,textTransform:'uppercase',letterSpacing:1}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{background:'#1f2937',padding:'14px 5%',display:'flex',justifyContent:'center',gap:28,flexWrap:'wrap',fontSize:13,fontWeight:600,color:'rgba(255,255,255,.75)'}}>
        {['✅ Fully Insured','🔒 Secure Payments','⭐ Rated & Reviewed','📱 Real-Time Updates','🤝 Dedicated Support'].map(t=><span key={t}>{t}</span>)}
      </div>

      {/* ABOUT */}
      <section id="about" style={{padding:'72px 5%',background:'#fff'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
          <div>
            <span style={{display:'inline-block',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#2B3BB5',background:'#eff6ff',padding:'5px 14px',borderRadius:999,marginBottom:14}}>🏠 Who We Are</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,3vw,38px)',color:'#2B3BB5',marginBottom:16,fontWeight:700}}>Cleaning Made Simple, Professional & Reliable</h2>
            <p style={{color:'#64748b',lineHeight:1.8,marginBottom:14,fontSize:15}}>The Chores connects homes, offices, hotels and schools with thoroughly vetted cleaning professionals across Waltham Cross and the surrounding areas.</p>
            <p style={{color:'#64748b',lineHeight:1.8,marginBottom:24,fontSize:15}}>Founded by Thecla Business Solutions, we believe everyone deserves a clean, healthy environment. Book, manage and pay for professional cleaning — all in one place.</p>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {['📍 Waltham Cross & Surrounding','🕐 Available 7 Days a Week','✅ All Pros DBS Checked'].map(p=>(
                <span key={p} style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:600,background:'#eff6ff',color:'#2B3BB5',padding:'6px 14px',borderRadius:999,border:'1px solid #bfdbfe'}}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {[{i:'💡',t:'Our Mission',d:'To make professional cleaning accessible, affordable and stress-free for every home and business.'},{i:'🌟',t:'Our Values',d:'Reliability, respect, quality and integrity are at the core of everything we do.'},{i:'🚀',t:'Our Vision',d:'To become the most trusted cleaning platform in the UK, one spotless space at a time.'}].map(c=>(
              <div key={c.t} style={{background:'#f8fafc',borderRadius:14,padding:'18px 20px',border:'1px solid #e5e7eb',transition:'all .2s'}}
                onMouseOver={e=>{e.currentTarget.style.borderColor='#2B3BB5';e.currentTarget.style.background='#eff6ff';}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.background='#f8fafc';}}>
                <div style={{fontSize:26,marginBottom:8}}>{c.i}</div>
                <h4 style={{fontWeight:700,color:'#2B3BB5',marginBottom:5,fontSize:14}}>{c.t}</h4>
                <p style={{fontSize:13,color:'#64748b',lineHeight:1.6}}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section style={{background:'#f8fafc',padding:'72px 5%'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <span style={{display:'inline-block',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#2B3BB5',background:'#eff6ff',padding:'5px 14px',borderRadius:999,marginBottom:14}}>🌍 Who We Serve</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,3vw,38px)',color:'#2B3BB5',fontWeight:700}}>Cleaning Every Kind of Space</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}}>
            {SERVE.map(c=>(
              <div key={c.t} style={{background:'#fff',borderRadius:16,padding:'22px',border:'1px solid #e5e7eb',transition:'all .2s'}}
                onMouseOver={e=>{e.currentTarget.style.borderColor='#2B3BB5';e.currentTarget.style.boxShadow='0 4px 20px rgba(43,59,181,.1)';}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.boxShadow='none';}}>
                <div style={{fontSize:30,marginBottom:12}}>{c.i}</div>
                <h4 style={{fontWeight:700,color:'#2B3BB5',marginBottom:10,fontSize:14}}>{c.t}</h4>
                <ul style={{listStyle:'none',padding:0,fontSize:13,color:'#64748b'}}>{c.items.map(i=><li key={i} style={{padding:'3px 0'}}>• {i}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES & PRICING */}
      <section id="services" style={{background:'#fff',padding:'72px 5%'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <span style={{display:'inline-block',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#2B3BB5',background:'#eff6ff',padding:'5px 14px',borderRadius:999,marginBottom:14}}>💰 Services & Pricing</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,3vw,38px)',color:'#2B3BB5',fontWeight:700,marginBottom:10}}>Transparent, Competitive Pricing</h2>
            <p style={{color:'#64748b',maxWidth:480,margin:'0 auto',fontSize:15}}>No hidden fees. You only pay when you're satisfied with the result.</p>
          </div>
          <div style={{border:'1px solid #e5e7eb',borderRadius:16,overflow:'hidden',maxWidth:700,margin:'0 auto'}}>
            {SERVICES.map((s,i)=>(
              <div key={s.id} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 22px',background:i%2===0?'#fff':'#f8fafc',borderBottom:i<SERVICES.length-1?'1px solid #e5e7eb':'none',transition:'background .15s'}}
                onMouseOver={e=>e.currentTarget.style.background='#eff6ff'}
                onMouseOut={e=>e.currentTarget.style.background=i%2===0?'#fff':'#f8fafc'}>
                <span style={{fontSize:24,flexShrink:0}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,color:'#1f2937',fontSize:14}}>{s.name}</p>
                  <p style={{fontSize:12,color:'#94a3b8',marginTop:1}}>{s.desc}</p>
                </div>
                <span style={{fontWeight:800,fontSize:16,color:'#2B3BB5',background:'#eff6ff',padding:'4px 14px',borderRadius:999,flexShrink:0}}>£{s.rate}/hr</span>
              </div>
            ))}
          </div>
          <p style={{textAlign:'center',fontSize:12,color:'#94a3b8',marginTop:14}}>Final pricing may vary based on property size and requirements.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{background:'linear-gradient(135deg,#1a3cbb,#2B3BB5)',padding:'72px 5%',color:'#fff'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <span style={{display:'inline-block',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,.6)',marginBottom:14}}>Simple Process</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,3vw,38px)',fontWeight:700}}>How It Works</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24}}>
            {HOW.map(s=>(
              <div key={s.n} style={{textAlign:'center'}}>
                <p style={{fontSize:40,fontWeight:800,color:'rgba(255,255,255,.12)',lineHeight:1,marginBottom:8}}>{s.n}</p>
                <div style={{fontSize:34,marginBottom:12}}>{s.i}</div>
                <h4 style={{fontWeight:700,marginBottom:8,fontSize:16}}>{s.t}</h4>
                <p style={{fontSize:13,color:'rgba(255,255,255,.7)',lineHeight:1.6}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{background:'#f8fafc',padding:'72px 5%'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <h2 style={{textAlign:'center',fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,3vw,38px)',color:'#2B3BB5',marginBottom:40,fontWeight:700}}>Why Choose The Chores?</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:18}}>
            {FEATS.map(f=>(
              <div key={f.t} style={{background:'#fff',borderRadius:16,padding:'22px',border:'1px solid #e5e7eb',transition:'all .2s'}}
                onMouseOver={e=>{e.currentTarget.style.borderColor='#2B3BB5';e.currentTarget.style.boxShadow='0 4px 20px rgba(43,59,181,.1)';}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.boxShadow='none';}}>
                <div style={{width:46,height:46,borderRadius:12,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:14}}>{f.i}</div>
                <h4 style={{fontWeight:700,color:'#2B3BB5',marginBottom:6,fontSize:14}}>{f.t}</h4>
                <p style={{fontSize:13,color:'#64748b',lineHeight:1.6}}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" style={{background:'#fff',padding:'72px 5%'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <span style={{display:'inline-block',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#2B3BB5',background:'#eff6ff',padding:'5px 14px',borderRadius:999,marginBottom:14}}>👥 Our Team</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(26px,3vw,38px)',color:'#2B3BB5',fontWeight:700}}>Meet Our Top Chores Pros</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:18}}>
            {[{n:'John Adeyemi',r:'Lead Cleaner · Residential',rating:'4.9 ⭐',i:'JA'},{n:'Amaka Okonkwo',r:'Commercial Specialist',rating:'4.7 ⭐',i:'AO'},{n:'David Osei',r:'Deep Clean Expert',rating:'4.8 ⭐',i:'DO'}].map(t=>(
              <div key={t.n} style={{background:'#f8fafc',borderRadius:16,padding:'24px',textAlign:'center',border:'1px solid #e5e7eb',transition:'all .2s'}}
                onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,.1)';}}
                onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'#2B3BB5',color:'#fff',fontSize:22,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>{t.i}</div>
                <h4 style={{fontWeight:700,color:'#2B3BB5',marginBottom:3,fontSize:15}}>{t.n}</h4>
                <p style={{fontSize:12,color:'#64748b',marginBottom:8}}>{t.r}</p>
                <span style={{fontWeight:700,fontSize:14}}>{t.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="book" style={{background:'linear-gradient(135deg,#2B3BB5,#1a5fbb)',padding:'72px 5%',color:'#fff',textAlign:'center'}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,4vw,44px)',marginBottom:14,fontWeight:700}}>Ready for a Spotless Space?</h2>
        <p style={{fontSize:16,opacity:.85,marginBottom:32,maxWidth:480,margin:'0 auto 32px'}}>Join hundreds of happy customers who trust The Chores.</p>
        <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={bookNow} style={{background:'#fff',color:'#2B3BB5',fontWeight:800,border:'none',padding:'14px 36px',borderRadius:50,fontSize:16,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 6px 24px rgba(0,0,0,.18)'}}>📅 Book Now →</button>
          <button onClick={()=>setModal('signup-client')} style={{background:'transparent',color:'#fff',border:'2px solid rgba(255,255,255,.6)',padding:'14px 28px',borderRadius:50,fontWeight:700,fontSize:15,cursor:'pointer',fontFamily:'inherit'}}>Create Account</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#0f1b2d',color:'rgba(255,255,255,.6)',fontSize:13,padding:'48px 5% 20px'}}>
<<<<<<< HEAD
        <div className="footer-grid" style={{maxWidth:1200,margin:'0 auto',marginBottom:32}}>
=======
        <div style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1.5fr',gap:36,marginBottom:32}}>
>>>>>>> abe6c28b9c96175c718e0398f2d1d590f37919a8
          <div>
            <img src={LOGO} alt="The Chores" style={{height:34,objectFit:'contain',marginBottom:12,filter:'brightness(10)'}}/>
            <p style={{fontSize:12,lineHeight:1.7,color:'rgba(255,255,255,.5)',maxWidth:240}}>A service by Thecla Business Solutions. Professional cleaning on demand across Waltham Cross and beyond.</p>
          </div>
          <div>
            <h4 style={{color:'#fff',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>Quick Links</h4>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {[['Book a Service',()=>bookNow()],['Sign Up as Customer',()=>setModal('signup-client')],['Join as Chores Pro',()=>setModal('signup-pro')],['Log In',()=>setModal('login')],['Terms & Conditions',()=>setModal('tc-client')],['Privacy Policy',()=>setModal('privacy')]].map(([l,fn])=>(
                <button key={l} onClick={fn} style={{background:'none',border:'none',color:'rgba(255,255,255,.55)',fontSize:13,textAlign:'left',cursor:'pointer',padding:0,fontFamily:'inherit',transition:'color .15s'}}
                  onMouseOver={e=>e.target.style.color='#7AD4F5'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,.55)'}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{color:'#fff',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>Services</h4>
            <div style={{display:'flex',flexDirection:'column',gap:7,fontSize:12,color:'rgba(255,255,255,.5)'}}>
              {SERVICES.map(s=><span key={s.id}>{s.icon} {s.name}</span>)}
            </div>
          </div>
          <div>
            <h4 style={{color:'#fff',fontSize:12,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>Contact</h4>
            <div style={{display:'flex',flexDirection:'column',gap:9,fontSize:12,color:'rgba(255,255,255,.55)'}}>
              <span>✉️ Thecla.e@theclaservices.com</span>
              <span>📍 Castle Court, Eleanor Way, Waltham Cross</span>
              <span>🌐 thechores.business</span>
              <span>📘 @thechores</span>
            </div>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:16,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10,fontSize:11,color:'rgba(255,255,255,.3)'}}>
          <span>© 2026 The Chores — operated by Thecla Business Solutions. All rights reserved.</span>
          <div style={{display:'flex',gap:16}}>
            {[['Terms & Conditions',()=>setModal('tc-client')],['Privacy Policy',()=>setModal('privacy')],['Admin Portal',()=>setModal('login')]].map(([l,fn])=>(
              <button key={l} onClick={fn} style={{background:'none',border:'none',color:'rgba(255,255,255,.35)',fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
