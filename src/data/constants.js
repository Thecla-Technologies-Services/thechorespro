export const SERVICES = [
  { id:'standard', name:'Standard Home Clean', icon:'🏠', rate:18, desc:'Regular home cleaning service' },
  { id:'deep',     name:'Deep Clean',           icon:'✨', rate:25, desc:'Top-to-bottom thorough clean' },
  { id:'eot',      name:'End-of-Tenancy',       icon:'🔑', rate:28, desc:'Move-out professional clean' },
  { id:'office',   name:'Office Cleaning',      icon:'🏢', rate:22, desc:'Commercial workspace cleaning' },
  { id:'hotel',    name:'Hotel Cleaning',       icon:'🏨', rate:25, desc:'Hospitality & room turnover' },
  { id:'school',   name:'School Cleaning',      icon:'🏫', rate:25, desc:'Educational facility cleaning' },
  { id:'laundry',  name:'Laundry & Ironing',    icon:'👕', rate:15, desc:'Wash, dry and iron service' },
  { id:'cooking',  name:'Cooking & Errands',    icon:'🍳', rate:20, desc:'Meal prep and errands' },
];

export const AREAS = [
  'Waltham Cross','Cheshunt','Enfield','Broxbourne','Hoddesdon','Hertford',
  'Hatfield','Stevenage','Welwyn Garden City','Ware','Harlow','Epping',
  'London N','London E','London SE','London SW','London W','London NW','Other',
];

export const ADMIN_CREDS = {
  email: 'thecla90@gmail.com',
  password: '1234567890',
  name: 'Thecla Admin',
};

export const SEED_BOOKINGS = [
  {
    id:'BK-001', clientName:'Sarah Clarke', clientEmail:'sarah@email.com',
    clientPhone:'+44 7700 900001', address:'12 London Rd, EN8 7LN', area:'Waltham Cross',
    svc:'Deep Clean', svcId:'deep', date:'2026-07-25', time:'10:00', dur:3,
    amount:75, status:'Confirmed', payment:'Pending', paymentDate:'',
    pro:'John Adeyemi', proEmail:'john@email.com', notes:'Please bring equipment',
    createdAt:'2026-07-18', rating:null, comment:'',
  },
  {
    id:'BK-002', clientName:'Mike Thompson', clientEmail:'mike@email.com',
    clientPhone:'+44 7700 900002', address:'8 Park Ave, EN8 9AB', area:'Cheshunt',
    svc:'Standard Home Clean', svcId:'standard', date:'2026-07-20', time:'09:00', dur:2,
    amount:36, status:'Completed', payment:'Paid', paymentDate:'2026-07-20',
    pro:'Amaka Okonkwo', proEmail:'amaka@email.com', notes:'',
    createdAt:'2026-07-17', rating:5, comment:'Absolutely brilliant, very thorough!',
    jobSummary:{ scheduledTime:'09:00', checkedIn:'09:05', completedAt:'11:10', minutesLate:5, minutesEarly:null },
  },
  {
    id:'BK-003', clientName:'Emma Wilson', clientEmail:'emma@email.com',
    clientPhone:'+44 7700 900003', address:'3 Oak St, EN8 2XZ', area:'Enfield',
    svc:'Office Cleaning', svcId:'office', date:'2026-07-28', time:'08:00', dur:4,
    amount:88, status:'Pending', payment:'Pending', paymentDate:'',
    pro:'', proEmail:'', notes:'3 floors, need key collected',
    createdAt:'2026-07-18', rating:null, comment:'',
  },
];

export const SEED_PROS = [
  {
    id:'PRO-001', name:'John Adeyemi', email:'john@email.com', password:'pro123',
    phone:'+44 7900 123456', address:'5 Maple St, EN8 4PQ', area:'Waltham Cross',
    services:['Standard Home Clean','Deep Clean','Laundry & Ironing'],
    cleaning_preference:'Residential',
    status:'Active', rating:4.9, jobsDone:48, joinedAt:'2024-01-15',
  },
  {
    id:'PRO-002', name:'Amaka Okonkwo', email:'amaka@email.com', password:'pro123',
    phone:'+44 7900 654321', address:'12 Elm Ave, EN1 3RS', area:'Enfield',
    services:['Office Cleaning','Hotel Cleaning','School Cleaning'],
    cleaning_preference:'Commercial',
    status:'Active', rating:4.7, jobsDone:32, joinedAt:'2024-03-10',
  },
];

export const SEED_CLIENTS = [
  {
    id:'CLI-001', name:'Sarah Clarke', email:'sarah@email.com', password:'pass123',
    phone:'+44 7700 900001', address:'12 London Rd, EN8 7LN', area:'Waltham Cross',
    joinedAt:'2024-01-20',
  },
  {
    id:'CLI-002', name:'Mike Thompson', email:'mike@email.com', password:'pass123',
    phone:'+44 7700 900002', address:'8 Park Ave, EN8 9AB', area:'Cheshunt',
    joinedAt:'2024-03-05',
  },
];

export const TC_CLIENT = `<h4>1. Acceptance of Terms</h4><p>By creating an account or making a booking through The Chores platform, you agree to these Terms in full.</p><h4>2. Bookings</h4><p>All bookings are subject to availability. You must provide accurate address and contact information and ensure access at the agreed time.</p><h4>3. Cancellations & Refunds</h4><p>Cancellations more than 24 hours before the service are free. Within 24 hours may incur a fee up to 50%.</p><h4>4. Payment</h4><p>A payment link will be sent to your email after booking. Funds are held in escrow and released only when you confirm the job is done.</p><h4>5. Liability</h4><p>All Chores Pros are vetted and insured. Damage claims must be reported within 24 hours.</p><h4>6. Contact</h4><p>Thecla.e@theclaservices.com · Castle Court, Eleanor Way, Waltham Cross · thechores.business</p>`;

export const TC_PRO = `<h4>1. Acceptance</h4><p>By joining The Chores as a professional, you agree to these Terms. You operate as a self-employed contractor.</p><h4>2. Professional Standards</h4><p>You must arrive on time, perform services to a professional standard, and communicate proactively.</p><h4>3. Payments</h4><p>You will be paid to your nominated bank account following job completion. The Chores deducts a platform commission.</p><h4>4. Conduct</h4><p>Unprofessional conduct, harassment, or platform misuse results in immediate suspension.</p><h4>5. Contact</h4><p>Thecla.e@theclaservices.com · Castle Court, Eleanor Way, Waltham Cross</p>`;

export const PRIVACY = `<h4>1. Information We Collect</h4><p>We collect your name, email, phone number, address, and booking history when you use The Chores platform.</p><h4>2. How We Use Your Data</h4><p>Your data is used to match you with service providers, process payments, send booking confirmations, and improve our service. We never sell your data.</p><h4>3. Your Rights</h4><p>You may request access, correction, or deletion of your data by contacting Thecla.e@theclaservices.com.</p><h4>4. Contact</h4><p>Thecla Business Solutions · Castle Court, Eleanor Way, Waltham Cross · thechores.business</p>`;
