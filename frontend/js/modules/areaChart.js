
class AreaChart{
  constructor(canvas,opts={}){this.c=canvas;this.ctx=canvas.getContext('2d');this.w=canvas.width;this.h=canvas.height;this.opts=Object.assign({stroke:'#7c3aed',fill:'rgba(124,58,237,0.35)',lineWidth:3,grid:'rgba(255,255,255,0.06)'},opts);window.addEventListener('resize',()=>this.resize());}
  resize(){const r=this.c.getBoundingClientRect();this.w=this.c.width=r.width*devicePixelRatio;this.h=this.c.height=r.height*devicePixelRatio;this.draw();}
  setData(arr){this.data=arr||[];this.resize();}
  draw(){const ctx=this.ctx;if(!ctx||!this.data)return;const W=this.w,H=this.h;ctx.clearRect(0,0,W,H);ctx.strokeStyle=this.opts.grid;ctx.lineWidth=1;for(let i=1;i<=3;i++){const y=H*i/4;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}if(this.data.length<2)return;const max=Math.max(...this.data)*1.1||1;const step=W/(this.data.length-1);ctx.beginPath();ctx.moveTo(0,H-(this.data[0]/max)*H);for(let i=1;i<this.data.length;i++){const x=i*step;const y=H-(this.data[i]/max)*H;ctx.lineTo(x,y);}ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fillStyle=this.opts.fill;ctx.fill();ctx.beginPath();ctx.moveTo(0,H-(this.data[0]/max)*H);for(let i=1;i<this.data.length;i++){const x=i*step;const y=H-(this.data[i]/max)*H;ctx.lineTo(x,y);}ctx.strokeStyle=this.opts.stroke;ctx.lineWidth=this.opts.lineWidth;ctx.stroke();}
}
window.AreaChart = AreaChart;
