
import express from 'express'; import cors from 'cors'; import nodemailer from 'nodemailer';
import fs from 'fs'; import path from 'path';
const app = express(); app.use(cors()); app.use(express.json());
const PORT = 3200;

// Basic info
app.get('/api/server/info', (req,res)=>res.json({ip:'127.0.0.1:25565', version:'Paper 1.20.x'}));

// Console echo
app.post('/api/console', (req,res)=>res.json({ok:true, echo: '> ' + (req.body?.cmd||'')}));

// Users & Roles
let USERS = [{id:1, name:"admin", email:"admin@example.com", role:"admin", twoFA:false},{id:2, name:"staff01", email:"staff01@example.com", role:"staff", twoFA:true}];
app.get('/api/users', (req,res)=>res.json({ok:true, users:USERS}));
app.post('/api/users/create', (req,res)=>{ const {name,email,role} = req.body||{}; const id = USERS.length? USERS[USERS.length-1].id+1 : 1; USERS.push({id,name,email,role:role||'user', twoFA:false}); res.json({ok:true, id}); });
app.post('/api/users/role', (req,res)=>{ const {id, role} = req.body||{}; const u = USERS.find(x=>x.id==id); if(!u) return res.status(404).json({ok:false, message:'User not found'}); u.role = role; res.json({ok:true}); });

// 2FA (stub)
let TWOFA = {};
app.post('/api/2fa/setup', (req,res)=>{ const {userId} = req.body||{}; TWOFA[userId] = {secret:'SIM-SECRET-123', enabled:false}; res.json({ok:true, qr:'data:image/png;base64,FAKEQR', secret:'SIM-SECRET-123'}); });
app.post('/api/2fa/verify', (req,res)=>{ const {userId, code} = req.body||{}; if(!/^[0-9]{6}$/.test(code||'')) return res.json({ok:false, message:'Invalid code'}); const u = USERS.find(x=>x.id==userId); if(u){ u.twoFA = true; } if(TWOFA[userId]) TWOFA[userId].enabled = true; res.json({ok:true}); });

// SMTP real (nodemailer)
function smtpTransportFromEnv(){
  const host = process.env.SMTP_HOST || ''; const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || ''; const pass = process.env.SMTP_PASS || '';
  const secure = /^(true|1|yes)$/i.test(process.env.SMTP_SECURE || 'false');
  if(!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}
app.get('/api/smtp/config', (req,res)=>{ res.json({ ok:true, host: process.env.SMTP_HOST || null, port: Number(process.env.SMTP_PORT || 587), user: process.env.SMTP_USER ? '(set)' : null, secure: /^(true|1|yes)$/i.test(process.env.SMTP_SECURE || 'false') }); });
app.post('/api/smtp/test', async (req,res)=>{
  try{
    const { to, subject='Test Email', template='welcome.html', vars={} } = req.body || {};
    const t = smtpTransportFromEnv(); if(!t){ return res.status(400).json({ok:false, message:'SMTP not configured: set SMTP_HOST/PORT/USER/PASS/SECURE envs'}); }
    const p = path.join(process.cwd(), 'emails', template);
    const html = fs.existsSync(p) ? fs.readFileSync(p,'utf-8') : `<p>${subject}</p>`;
    const htmlFilled = html.replace(/\{\{(.*?)\}\}/g, (_,k)=> String(vars[k.trim()] ?? ''));
    const info = await t.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, html: htmlFilled });
    res.json({ok:true, message:'Email sent', id: info.messageId});
  }catch(e){ res.status(500).json({ok:false, message:String(e)}); }
});

// Other stubs for modules (extend as needed)
app.post('/api/modpack/install', (req,res)=>res.json({ok:true, message:'install queued'}));
app.post('/api/modpack/remove', (req,res)=>res.json({ok:true}));
app.post('/api/world/create', (req,res)=>res.json({ok:true}));
app.post('/api/world/backup', (req,res)=>res.json({ok:true}));
app.post('/api/world/restore', (req,res)=>res.json({ok:true}));
app.post('/api/world/delete', (req,res)=>res.json({ok:true}));
app.post('/api/egg/change', (req,res)=>res.json({ok:true}));
app.post('/api/backup/run', (req,res)=>res.json({ok:true}));
app.post('/api/backup/schedule', (req,res)=>res.json({ok:true}));
app.post('/api/split/create', (req,res)=>res.json({ok:true, message:'Split created'}));

app.listen(PORT, ()=>console.log('Panel API on http://localhost:'+PORT));
