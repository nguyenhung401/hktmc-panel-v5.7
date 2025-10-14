
const BACKEND_URL = 'http://localhost:3200';

(function(){
  const cpuC=document.getElementById('cpuChart'); const memC=document.getElementById('memChart'); const netC=document.getElementById('netChart');
  if(window.AreaChart && cpuC&&memC&&netC){
    const cpu=new AreaChart(cpuC), mem=new AreaChart(memC), net=new AreaChart(netC);
    function gen(n,b){const a=[];let v=b;for(let i=0;i<n;i++){v=Math.max(1,v+(Math.random()*10-5));a.push(v);}return a;}
    function rnd(v){return Math.max(0.05, v+(Math.random()*0.6-0.3));}
    let tx=Array(40).fill(0.8);
    function tick(){
      const c=gen(40,25), m=gen(40,2048);
      cpu.setData(c); mem.setData(m);
      document.getElementById('cpuTxt').innerText=(c.at(-1)).toFixed(1)+'% / ∞';
      document.getElementById('memTxt').innerText=(m.at(-1)/1024).toFixed(2)+' GiB / 8 GiB';
      tx=[...tx.slice(1), rnd(tx.at(-1))]; net.setData(tx);
      document.getElementById('netTxt').innerText='↑ '+tx.at(-1).toFixed(2)+' MB/s • ↓ '+(tx.at(-3)||tx.at(-1)).toFixed(2)+' MB/s';
    }
    tick(); setInterval(tick,2000);
  }
})();

// Console
(function(){
  const out=document.getElementById('console');
  function log(line){ out.textContent += line + "\n"; out.scrollTop = out.scrollHeight; }
  document.getElementById('sendCmd').addEventListener('click', ()=>{
    const i=document.getElementById('cmdInput'); const cmd=i.value.trim(); if(!cmd) return;
    fetch(BACKEND_URL+'/api/console', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({cmd})})
      .then(r=>r.json()).then(d=>log(d.echo||cmd)).catch(()=>log('[sim] '+cmd)); i.value='';
  });
  if(window.AreaChart){
    const conC=document.getElementById('netChartConsole'), chart=new AreaChart(conC);
    let s=Array(40).fill(0.8); function rnd(v){return Math.max(0.05, v+(Math.random()*0.6-0.3));}
    setInterval(()=>{ s=[...s.slice(1), rnd(s.at(-1))]; chart.setData(s); }, 2000);
  }
})();
