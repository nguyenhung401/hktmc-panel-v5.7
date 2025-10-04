import { useState, useEffect } from "react";

export default function App(){
  const [backups, setBackups] = useState([]);
  const [file, setFile] = useState();

  async function load(){ 
    const r = await fetch("http://localhost:5174/backup/list");
    setBackups((await r.json()).backups);
  }
  useEffect(()=>{load();},[]);

  async function runBackup(){ 
    await fetch("http://localhost:5174/backup/run",{method:"POST"}); 
    load();
  }

  async function restore(){ 
    const f = new FormData(); f.append("file", file);
    await fetch("http://localhost:5174/backup/restore",{method:"POST", body:f});
    alert("Restored!");
  }

  return (
  <div style={{padding:20,fontFamily:"sans-serif"}}>
    <h1>hktmc Panel Manager - Backup Settings</h1>
    <button onClick={runBackup}>Run Backup Now</button>
    <h2>Upload Backup ZIP to Restore</h2>
    <input type="file" onChange={e=>setFile(e.target.files[0])}/>
    <button onClick={restore}>Restore</button>
    <h2>Available Backups</h2>
    <ul>
      {backups.map(b=>
        <li key={b}>
          {b}{" "}
          <a href={`http://localhost:5174/backup/download/${b}`}>Download</a>
        </li>
      )}
    </ul>
  </div>);
      }
