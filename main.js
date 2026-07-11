// ── DATA ──
const BASE = [3,2,4,3,2,4,-4,-3,-5];
const LEV  = [3,2,4,6,4,8,-8,-6,-10];

const balLev=[100], balBase=[100];
BASE.forEach((r,i)=>{
  balBase.push(+(balBase[i]*(1+r/100)).toFixed(4));
  balLev.push(+(balLev[i]*(1+LEV[i]/100)).toFixed(4));
});

// Scenario 1: 0050 flat (×1.1 × 10/11 = 1); 正二 loses (54/55)^n per round
const ZZ_MAX_ROUNDS = 50;
const zzBase=[100], zzLev=[100];
for(let i=0;i<ZZ_MAX_ROUNDS;i++){
  zzBase.push(+(zzBase[zzBase.length-1]*1.1).toFixed(6));
  zzBase.push(+(zzBase[zzBase.length-1]*(10/11)).toFixed(6));
  zzLev.push(+(zzLev[zzLev.length-1]*1.2).toFixed(6));
  zzLev.push(+(zzLev[zzLev.length-1]*(9/11)).toFixed(6));
}

// Scenario 2: 0050 gently climbs (×121/120 per round); 正二 flat (×1.2 × 5/6 = 1)
const zzBase3=[100], zzLev3=[100];
for(let i=0;i<ZZ_MAX_ROUNDS;i++){
  zzBase3.push(+(zzBase3[zzBase3.length-1]*1.1).toFixed(6));
  zzBase3.push(+(zzBase3[zzBase3.length-1]*(11/12)).toFixed(6));
  zzLev3.push(+(zzLev3[zzLev3.length-1]*1.2).toFixed(6));
  zzLev3.push(+(zzLev3[zzLev3.length-1]*(5/6)).toFixed(6));
}

// ── HISTORICAL EVENTS (real daily returns from 0050 ETF close prices) ──
const HIST_EVENTS = [
  {
    id:'covid', name:'COVID 崩跌', period:'2019/12 – 2020/06',
    days:[-0.204,-0.869,0.722,0,-1.28,-0.311,-0.468,1.359,0.361,0.719,0.612,-1.014,-0.307,0,0.411,-5.681,-2.387,-1.001,1.741,0.276,1.596,-1.192,-0.219,0.824,0.981,0.162,0.162,-0.699,-1.354,1.153,-0.434,-0.491,-1.26,0.277,-0.996,-0.894,-1.466,1.431,0.677,1.121,-2.051,-2.83,0.524,-1.159,-3.693,-1.4,-4.568,-3.169,-2.739,-5.838,7.95,-4.324,4.873,3.502,0.455,-0.777,-0.979,0.396,-0.328,1.515,1.882,1.401,-0.44,0.063,-0.631,2.728,0.309,-0.493,3.032,-0.3,-2.892,0,0.372,0,2.04,0,1.393,2.151,-2.924,0.482,0.12,0.419,0.596,0.83,-1.176,0.297,-1.186,0.66,-0.835,0.902,-0.119,0.835,-1.834,0.663,1.138,-0.118,-0.593,0.716,0.533]
  },
  {
    id:'rebound', name:'V 型大反彈', period:'2020/03 – 08',
    days:[7.95,-4.324,4.873,3.502,0.455,-0.777,-0.979,0.396,-0.328,1.515,1.882,1.401,-0.44,0.063,-0.631,2.728,0.309,-0.493,3.032,-0.3,-2.892,0,0.372,0,2.04,0,1.393,2.151,-2.924,0.482,0.12,0.419,0.596,0.83,-1.176,0.297,-1.186,0.66,-0.835,0.902,-0.119,0.835,-1.834,0.663,1.138,-0.118,-0.593,0.716,0.533,0.471,1.758,0.922,0.856,1.302,0.112,0.949,-1.548,-0.898,-1.416,2.184,0.112,-0.112,-0.056,0.225,0.449,0.615,-1,0.898,0.667,1.105,1.148,1.729,0.372,0.688,0.315,-0.838,1.479,0.625,0.414,-0.979,1.145,-0.154,1.7,0.253,-0.101,-0.354,4.873,0.29,-1.014,1.463,-0.24,-1.734,1.275,0.968,1.055,-0.712,0.908,-0.758,-1.479,0.969]
  },
  {
    id:'debt2011', name:'歐債危機', period:'2011/07 – 11',
    days:[0.586,-0.167,1.084,-0.413,-0.497,-0.666,-1.593,0,0.341,0.509,-0.338,-0.169,2.632,0.248,0.66,-0.984,1.325,0.245,-0.815,-1.561,0.751,-1.326,-1.595,-1.28,-5.877,-1.745,-0.935,2.075,0,-1.017,1.961,-0.458,-0.736,-1.854,-3.494,0.783,3.495,-1.313,-0.475,1.337,1.414,0.743,0.646,1.1,0,-2.811,-1.959,1.903,0.28,0.838,-2.77,-1.994,2.422,2.365,-1.664,0.376,0.375,-2.799,-3.359,-2.046,3.609,0.098,0.88,0.097,-2.614,0.895,-0.985,1.99,0.585,2.813,-0.283,-0.095,-0.663,1.239,-1.036,-0.381,-1.146,0.386,3.176,0,-2.705,0.192,0.287,-0.382,0.67,-0.285,-1.813,1.652,0.191,-0.477,0.096,-3.161,0.692,2.456,-0.575,-1.254,0.293,-2.045,-2.127,-0.427]
  },
  {
    id:'bear2022', name:'升息熊市', period:'2022/01 – 06',
    days:[2.186,-0.201,-0.938,-0.879,0.648,0.508,0.843,0.502,0,1.131,-1.118,-1.198,0.404,-4.326,0.946,-1.632,-0.071,0.53,0.422,0.35,1.151,-0.069,-1.552,-0.455,1.654,0.069,-0.277,-0.208,-1.356,0.282,-2.425,-0.216,1.408,-0.57,0.215,-1.072,-3.214,-2.127,1.029,2.906,-1.43,0,-2.046,0.418,3.177,-0.22,0.661,-0.146,0.95,-0.072,0.145,-1.085,0.11,1.242,-0.325,-0.833,-0.511,-1.798,0.561,-1.561,0.076,1.886,-0.37,-1.709,-0.529,0.342,0.492,0.075,-0.866,-1.786,0,-2.089,0.435,1.298,-0.738,0,1.135,-2.012,-1.658,-0.442,0.161,-2.375,0.907,0.531,1.098,1.086,-1.909,1.095,0.201,-1.121,0.769,-1.245,2.116,2.43,0.972,-0.501,-1.045,0.704,-1.01,1.099]
  },
  {
    id:'ai_bull', name:'AI 多頭', period:'2026/01 – 06',
    days:[0.691,2.058,3.809,1.295,-0.781,0.358,-0.357,0.716,0.498,0.071,-0.141,1.911,0.833,0,-1.033,-0.07,0.627,0,1.107,1.574,-0.606,-1.559,-1.515,2.028,-0.069,-1.235,-0.139,2.851,2.096,2.252,0.259,2.584,2.141,0.062,-0.986,-1.991,-4,2.381,-0.711,-4.229,2.174,3.989,-2.046,-0.849,-0.461,1.389,1.5,-2.314,-0.132,-2.174,0.202,2.419,-0.525,-1.055,-1.467,-2.097,4.285,-1.988,1.826,5.179,-0.063,2.021,-0.186,3.102,1.264,1.01,-1,0.475,1.715,0.407,0,4.169,3.391,-1.075,-1.359,-0.275,4.53,0,1.216,2.037,-0.716,-0.103,-0.052,-1.394,0.576,-0.677,-0.524,-1.897,-0.644,3.622,1.513,3.597,-0.694,2.448,-1.999,4.876,0.095,0.19,1.798]
  }
];

// ── STATE ──
const $=id=>document.getElementById(id);
const fmtP=v=>(v>=0?'+':'')+v.toFixed(2)+'%';
const pClr=v=>v>0?'var(--green)':v<0?'var(--red)':'var(--muted)';

let cur=-1, userChoice=null;
let zzAnimTimer=null, zzAnimRound=3;
let zzAnim2Timer=null, zzAnim2Round=1;
let barsAnimFrame=null;
let prevYouV=100, prevHuaV=100, balAnimFrame=null;
let selectedEv=null, evAnimTimer=null, evAnimDay=0;
let evBase=[100], evLev=[100];

function levBals(){ return userChoice==='base'? balBase : balLev; }
function baseBals(){ return userChoice==='base'? balLev : balBase; }
function levReturns(){ return userChoice==='base'? BASE : LEV; }
function baseReturns(){ return userChoice==='base'? LEV : BASE; }

function stepToDayIdx(step){
  if(step===0) return 0;
  if(step<=3) return step;
  if(step===4) return 3;
  if(step<=7) return step-1;
  if(step===8) return 6;
  if(step>=9&&step<=12) return step-2;
  return 9;
}

function updateViz(step){
  if(step===cur) return;
  cur=step;
  stopZzAnim();
  stopZzAnim2();
  stopEvAnim();

  updateChars(step);

  if(step<=7){
    showPanel('bars');
    animateVerticalBars(step);
  } else if(step<=12){
    if(barsAnimFrame){ cancelAnimationFrame(barsAnimFrame); barsAnimFrame=null; }
    showPanel('chart');
    drawMainChart(step-2);
    updateDrops(step);
    $('peakBox').style.display = step>=12 ? 'block' : 'none';
    if(step>=12) fillPeakBox();
  } else if(step<=17){
    if(barsAnimFrame){ cancelAnimationFrame(barsAnimFrame); barsAnimFrame=null; }
    showPanel('zigzag');
    if(step >= 17){
      drawZzChart(3);
      updateZzTable(3);
      $('zzBody').style.display='';
      $('zzCounter').style.display='none';
      startZzAnim();
    } else {
      const rounds = step - 13;
      drawZzChart(rounds);
      updateZzTable(rounds);
      $('zzBody').style.display='';
      $('zzCounter').style.display='none';
    }
  } else if(step<=19){
    if(barsAnimFrame){ cancelAnimationFrame(barsAnimFrame); barsAnimFrame=null; }
    showPanel('zigzag2');
    if(step >= 19){
      drawZzChart(1,'zzChart2',zzLev3,zzBase3);
      updateZzTable2(1);
      $('zzBody2').style.display='';
      $('zzCounter2').style.display='none';
      startZzAnim2();
    } else {
      drawZzChart(1,'zzChart2',zzLev3,zzBase3);
      updateZzTable2(1);
      $('zzBody2').style.display='';
      $('zzCounter2').style.display='none';
    }
  } else {
    if(barsAnimFrame){ cancelAnimationFrame(barsAnimFrame); barsAnimFrame=null; }
    showPanel('event');
  }
}

function showPanel(which){
  const bp=$('barsPanel'), cp=$('chartPanel'), zp=$('zigzagPanel'), zp2=$('zigzagPanel2'), ep=$('eventPanel');
  bp.style.display = which==='bars' ? 'block' : 'none';
  if(which==='chart'){
    cp.classList.add('on');
    requestAnimationFrame(()=>requestAnimationFrame(()=>cp.classList.add('vis')));
  } else {
    cp.classList.remove('vis');
    setTimeout(()=>cp.classList.remove('on'),400);
  }
  [['zigzag',zp],['zigzag2',zp2],['event',ep]].forEach(([name,panel])=>{
    if(which===name){
      panel.classList.add('on');
      requestAnimationFrame(()=>requestAnimationFrame(()=>panel.classList.add('vis')));
    } else {
      panel.classList.remove('vis');
      setTimeout(()=>panel.classList.remove('on'),400);
    }
  });
}

function updateChars(step){
  const d=stepToDayIdx(step);
  const lv=levBals()[d]||100, bv=baseBals()[d]||100;
  const youIsLev = !userChoice||userChoice==='lev';
  const youV=youIsLev?lv:bv, huaV=youIsLev?bv:lv;
  const youP=(youV/100-1)*100, huaP=(huaV/100-1)*100;

  if(balAnimFrame){ cancelAnimationFrame(balAnimFrame); balAnimFrame=null; }
  const fromYou=prevYouV, fromHua=prevHuaV;
  prevYouV=youV; prevHuaV=huaV;

  const diff=Math.abs(fromYou-youV)+Math.abs(fromHua-huaV);
  if(step>=1 && step<=12 && diff>0.05){
    const fromYouP=(fromYou/100-1)*100, fromHuaP=(fromHua/100-1)*100;
    const t0=performance.now(), dur=350;
    const anim=now=>{
      const t=Math.min((now-t0)/dur,1);
      const e=1-Math.pow(1-t,2);
      const cy=fromYou+(youV-fromYou)*e;
      const ch=fromHua+(huaV-fromHua)*e;
      const cyP=fromYouP+(youP-fromYouP)*e;
      const chP=fromHuaP+(huaP-fromHuaP)*e;
      $('youBal').innerHTML=cy.toFixed(1)+'<small style="font-size:.55em;font-weight:400"> 萬</small>';
      $('huaBal').innerHTML=ch.toFixed(1)+'<small style="font-size:.55em;font-weight:400"> 萬</small>';
      $('youPnl').textContent=fmtP(cyP); $('youPnl').style.color=pClr(cyP);
      $('huaPnl').textContent=fmtP(chP); $('huaPnl').style.color=pClr(chP);
      if(t<1) balAnimFrame=requestAnimationFrame(anim);
      else balAnimFrame=null;
    };
    balAnimFrame=requestAnimationFrame(anim);
  } else {
    $('youBal').innerHTML=youV.toFixed(1)+'<small style="font-size:.55em;font-weight:400"> 萬</small>';
    $('huaBal').innerHTML=huaV.toFixed(1)+'<small style="font-size:.55em;font-weight:400"> 萬</small>';
    $('youPnl').textContent=fmtP(youP); $('youPnl').style.color=pClr(youP);
    $('huaPnl').textContent=fmtP(huaP); $('huaPnl').style.color=pClr(huaP);
  }

  const youEtf=$('youEtf'), huaEtf=$('huaEtf');
  if(userChoice==='lev'){
    youEtf.textContent='0050 正 2'; youEtf.classList.add('lev');
    huaEtf.textContent='0050'; huaEtf.classList.remove('lev');
  } else if(userChoice==='base'){
    youEtf.textContent='0050'; youEtf.classList.remove('lev');
    huaEtf.textContent='0050 正 2'; huaEtf.classList.add('lev');
  } else {
    youEtf.textContent='0050'; youEtf.classList.remove('lev');
    huaEtf.textContent='0050'; huaEtf.classList.remove('lev');
  }

  const yc=$('youCard'),hc=$('huaCard');
  yc.classList.remove('winning','losing'); hc.classList.remove('winning','losing');
  if(step>=5&&step<=7){
    if(youIsLev) yc.classList.add('winning'); else hc.classList.add('winning');
  }
  if(step>=11){
    if(youIsLev) yc.classList.add('losing'),hc.classList.add('winning');
    else hc.classList.add('losing'),yc.classList.add('winning');
  }

  $('charRow').style.display = step>=13 ? 'none' : 'grid';
}

function drawVerticalBars(step, progress){
  if(progress===undefined) progress=1;
  const canvas=$('barsCanvas');
  if(!canvas||!canvas.offsetWidth) return;
  const dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth,H=canvas.offsetHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,W,H);

  const numDays=stepToDayIdx(step);
  if(numDays===0) return;

  $('barsLeg').style.display=(userChoice!==null&&numDays>=4)?'flex':'none';

  const P={t:20,r:8,b:26,l:32};
  const cw=W-P.l-P.r, ch=H-P.t-P.b;
  const maxPct=10, minPct=-1, range=maxPct-minPct;
  const yOf=pct=>P.t+ch*(maxPct-pct)/range;
  const zeroY=yOf(0);

  [0,5,10].forEach(v=>{
    const y=yOf(v);
    ctx.strokeStyle=v===0?'rgba(255,255,255,.2)':'rgba(255,255,255,.07)';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(P.l,y);ctx.lineTo(P.l+cw,y);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='7px system-ui';ctx.textAlign='right';
    ctx.fillText(v+'%',P.l-3,y+3);
  });

  const slotW=cw/6;

  function drawBar(cx,bw,pct,barColor,lblColor,isNew){
    const p=isNew?progress:1;
    const y0=zeroY, yp=yOf(pct);
    const bh=Math.abs(yp-y0)||1;
    const animH=bh*p;
    const by=pct>=0?y0-animH:y0;
    ctx.fillStyle=pct>=0?barColor:'#f7617a';
    ctx.fillRect(cx-bw/2,by,bw,animH);
    ctx.fillStyle=lblColor;
    ctx.globalAlpha=p>=0.55?(p-0.55)/0.45:0;
    ctx.font='7px system-ui';ctx.textAlign='center';
    const lbl=(pct>0?'+':'')+pct+'%';
    ctx.fillText(lbl,cx,pct>=0?yp-4:y0+bh+9);
    ctx.globalAlpha=1;
  }

  for(let d=1;d<=numDays;d++){
    const cx=P.l+(d-0.5)*slotW;
    const isNew=d===numDays;
    const isPhaseB=d>=4&&userChoice!==null;
    if(!isPhaseB){
      drawBar(cx,slotW*0.52,BASE[d-1],'#3dd68c','rgba(255,255,255,.75)',isNew);
    } else {
      const rl=levReturns()[d-1], rb=baseReturns()[d-1];
      const subW=slotW*0.38, gap=slotW*0.07;
      drawBar(cx-subW/2-gap/2,subW,rl,'#4f8ef7','#7ab0ff',isNew);
      drawBar(cx+subW/2+gap/2,subW,rb,'#3dd68c','#7ae8b5',isNew);
    }
    ctx.fillStyle='rgba(255,255,255,.35)';ctx.font='7px system-ui';ctx.textAlign='center';
    ctx.fillText('D'+d,cx,P.t+ch+18);
  }
}

function animateVerticalBars(step){
  if(barsAnimFrame){ cancelAnimationFrame(barsAnimFrame); barsAnimFrame=null; }
  const numDays=stepToDayIdx(step);
  if(numDays===0){ drawVerticalBars(step,1); return; }
  const t0=performance.now(), dur=480;
  const ease=t=>1-Math.pow(1-t,3);
  const frame=now=>{
    const t=Math.min((now-t0)/dur,1);
    drawVerticalBars(step,ease(t));
    if(t<1) barsAnimFrame=requestAnimationFrame(frame);
    else barsAnimFrame=null;
  };
  barsAnimFrame=requestAnimationFrame(frame);
}

function drawMainChart(numDays){
  const canvas=$('theChart');
  if(!canvas||!canvas.offsetWidth) return;
  const dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth,H=canvas.offsetHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  const ld=levBals().slice(0,numDays+1), bd=baseBals().slice(0,numDays+1);
  const all=[...ld,...bd], minV=Math.min(...all)-1.5, maxV=Math.max(...all)+1.5;
  const P={t:14,r:10,b:28,l:48};
  const cw=W-P.l-P.r, ch=H-P.t-P.b;
  const xOf=i=>P.l+(i/9)*cw, yOf=v=>P.t+ch-(v-minV)/(maxV-minV)*ch;
  ctx.clearRect(0,0,W,H);
  [100,105,110,115,120,125,130].forEach(v=>{
    const y=yOf(v); if(y<P.t||y>P.t+ch) return;
    ctx.strokeStyle='rgba(255,255,255,.05)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P.l,y); ctx.lineTo(P.l+cw,y); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.25)'; ctx.font='8px system-ui'; ctx.textAlign='right';
    ctx.fillText(v+'萬',P.l-3,y+3);
  });
  ['起','D1','D2','D3','D4','D5','D6','D7','D8','D9'].slice(0,numDays+2).forEach((lb,i)=>{
    ctx.fillStyle='rgba(255,255,255,.2)'; ctx.font='7px system-ui'; ctx.textAlign='center';
    ctx.fillText(lb,xOf(i),P.t+ch+17);
  });
  if(numDays>=3){
    ctx.setLineDash([3,4]); ctx.strokeStyle='rgba(79,142,247,.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(xOf(3),P.t); ctx.lineTo(xOf(3),P.t+ch); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle='rgba(79,142,247,.45)'; ctx.font='7px system-ui'; ctx.textAlign='center';
    ctx.fillText('換正二',xOf(3),P.t+8);
  }
  if(numDays>=7){
    ctx.setLineDash([3,4]); ctx.strokeStyle='rgba(247,97,122,.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(xOf(6),P.t); ctx.lineTo(xOf(6),P.t+ch); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle='rgba(247,97,122,.4)'; ctx.font='7px system-ui'; ctx.textAlign='center';
    ctx.fillText('開跌',xOf(6),P.t+8);
  }
  function line(data,color){
    ctx.strokeStyle=color; ctx.lineWidth=2.5; ctx.lineJoin='round';
    ctx.beginPath(); data.forEach((v,i)=>i===0?ctx.moveTo(xOf(i),yOf(v)):ctx.lineTo(xOf(i),yOf(v))); ctx.stroke();
    ctx.fillStyle=color; ctx.beginPath(); ctx.arc(xOf(data.length-1),yOf(data[data.length-1]),4,0,Math.PI*2); ctx.fill();
  }
  line(bd,'#3dd68c'); line(ld,'#4f8ef7');
}

function updateDrops(step){
  const c=$('dropEntries'); c.innerHTML='';
  const count=Math.max(0,step-8);
  [7,8,9].slice(0,count).forEach(d=>{
    const rl=levReturns()[d-1], rb=baseReturns()[d-1];
    const el=document.createElement('div'); el.className='drop-entry';
    el.innerHTML=`<span class="drop-day">Day ${d}</span>
      <span class="you-d" style="color:var(--red)">${rl}%</span>
      <span style="color:var(--muted);font-size:.7rem">正二</span>
      <span class="hua-d" style="color:var(--orange)">${rb}%</span>
      <span style="color:var(--muted);font-size:.7rem">0050</span>`;
    c.appendChild(el);
  });
}

function fillPeakBox(){
  const lPeak=Math.max(...levBals()), lEnd=levBals()[9];
  const bPeak=Math.max(...baseBals()), bEnd=baseBals()[9];
  const lDrop=(lEnd/lPeak-1)*100, bDrop=(bEnd/bPeak-1)*100;
  const ratio=Math.abs(lDrop)/Math.abs(bDrop);
  $('levDrop').textContent=fmtP(lDrop);
  $('baseDrop').textContent=fmtP(bDrop);
  $('dropRatio').textContent=ratio.toFixed(2)+'x';
}

// ── ZIGZAG ──
function drawZzChart(rounds, canvasId, levData, baseData){
  canvasId=canvasId||'zzChart'; levData=levData||zzLev; baseData=baseData||zzBase;
  const canvas=$(canvasId);
  if(!canvas||!canvas.offsetWidth) return;
  const dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth,H=canvas.offsetHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  const pts=rounds*2+1;
  const ld=levData.slice(0,pts), bd=baseData.slice(0,pts);
  const all=[...ld,...bd];
  const rawMin=Math.min(...all), rawMax=Math.max(...all);
  const pad=(rawMax-rawMin)*0.08+2;
  const minV=rawMin-pad, maxV=rawMax+pad;
  const P={t:12,r:10,b:20,l:48};
  const cw=W-P.l-P.r, ch=H-P.t-P.b;
  const maxI=pts>1?pts-1:1;
  const xOf=i=>P.l+(i/maxI)*cw;
  const yOf=v=>P.t+ch-(v-minV)/(maxV-minV)*ch;
  ctx.clearRect(0,0,W,H);
  const yRange=rawMax-rawMin;
  const gridStep=yRange>40?20:yRange>15?10:yRange>6?5:2;
  const firstGrid=Math.ceil(minV/gridStep)*gridStep;
  for(let v=firstGrid;v<=maxV;v+=gridStep){
    const y=yOf(v); if(y<P.t-2||y>P.t+ch+2) continue;
    ctx.strokeStyle=v===100?'rgba(255,255,255,.12)':'rgba(255,255,255,.05)';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(P.l,y);ctx.lineTo(P.l+cw,y);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.22)';ctx.font='8px system-ui';ctx.textAlign='right';
    ctx.fillText(Math.round(v),P.l-3,y+3);
  }
  const y100=yOf(100);
  ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(P.l,y100);ctx.lineTo(P.l+cw,y100);ctx.stroke();ctx.setLineDash([]);
  const labelStep=rounds<=4?1:rounds<=10?2:rounds<=20?5:rounds<=35?10:15;
  for(let r=0;r<=rounds;r++){
    if(r%labelStep!==0&&r!==rounds) continue;
    ctx.fillStyle='rgba(255,255,255,.2)';ctx.font='7px system-ui';ctx.textAlign='center';
    ctx.fillText(r===0?'起':`R${r}`,xOf(r*2),P.t+ch+14);
  }
  const lw=rounds>10?1.5:2.5;
  function line(data,color){
    ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.lineJoin='round';
    ctx.beginPath();data.forEach((v,i)=>i===0?ctx.moveTo(xOf(i),yOf(v)):ctx.lineTo(xOf(i),yOf(v)));ctx.stroke();
    const last=data[data.length-1];
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(xOf(data.length-1),yOf(last),rounds>10?2.5:3.5,0,Math.PI*2);ctx.fill();
  }
  line(bd,'#3dd68c');line(ld,'#4f8ef7');
}

function updateZzTable(rounds){
  const body=$('zzBody'); body.innerHTML='';
  for(let i=1;i<=rounds;i++){
    const lv=zzLev[i*2], bv=zzBase[i*2];
    const lp=((lv/100)-1)*100;
    const gap=(bv-lv).toFixed(2);
    const tr=document.createElement('tr'); tr.className='zz-row';
    tr.innerHTML=`<td>第${i}輪後</td>
      <td style="color:var(--red);font-weight:700">${lv.toFixed(2)} 萬<br><small>${fmtP(lp)}</small></td>
      <td style="color:var(--green);font-weight:700">${bv.toFixed(1)} 萬<br><small style="color:var(--muted)">±0%</small></td>
      <td style="color:var(--red);font-weight:700">-${gap} 萬</td>`;
    body.appendChild(tr);
  }
}

function stopZzAnim(){
  if(zzAnimTimer){ clearTimeout(zzAnimTimer); zzAnimTimer=null; }
}

function updateZzCounter(r){
  const lv=zzLev[r*2], bv=zzBase[r*2];
  const lp=((lv/100)-1)*100;
  $('zzRoundNum').textContent=`第 ${r} 輪`;
  $('zzLevVal').textContent=lv.toFixed(1);
  $('zzLevPct').textContent=' ('+fmtP(lp)+')';
  $('zzBaseVal').textContent=bv.toFixed(1);
}

function startZzAnim(){
  stopZzAnim();
  zzAnimRound=3;
  $('zzBody').style.display='none';
  $('zzCounter').style.display='block';
  updateZzCounter(3);
  const tick=()=>{
    zzAnimRound=Math.min(zzAnimRound+1, ZZ_MAX_ROUNDS);
    drawZzChart(zzAnimRound);
    updateZzCounter(zzAnimRound);
    if(zzAnimRound>=ZZ_MAX_ROUNDS){ zzAnimTimer=null; return; }
    const delay=zzAnimRound<=6?500:zzAnimRound<=12?300:zzAnimRound<=25?180:100;
    zzAnimTimer=setTimeout(tick,delay);
  };
  zzAnimTimer=setTimeout(tick,700);
}

// ── ZIGZAG SCENARIO 2 ──
function updateZzTable2(rounds){
  const body=$('zzBody2'); body.innerHTML='';
  for(let i=1;i<=rounds;i++){
    const lv=zzLev3[i*2], bv=zzBase3[i*2];
    const bp=((bv/100)-1)*100;
    const gap=(bv-lv).toFixed(2);
    const tr=document.createElement('tr'); tr.className='zz-row';
    tr.innerHTML=`<td>第${i}輪後</td>
      <td style="color:var(--muted);font-weight:700">${lv.toFixed(1)} 萬<br><small style="color:var(--muted)">±0%</small></td>
      <td style="color:var(--green);font-weight:700">${bv.toFixed(2)} 萬<br><small>${fmtP(bp)}</small></td>
      <td style="color:var(--green);font-weight:700">+${gap} 萬</td>`;
    body.appendChild(tr);
  }
}

function stopZzAnim2(){
  if(zzAnim2Timer){ clearTimeout(zzAnim2Timer); zzAnim2Timer=null; }
}

function updateZzCounter2(r){
  const lv=zzLev3[r*2], bv=zzBase3[r*2];
  const bp=((bv/100)-1)*100;
  $('zzRoundNum2').textContent=`第 ${r} 輪`;
  $('zzLevVal2').textContent=lv.toFixed(1);
  $('zzBaseVal2').textContent=bv.toFixed(2);
  $('zzBasePct2').textContent=' ('+fmtP(bp)+')';
}

function startZzAnim2(){
  stopZzAnim2();
  zzAnim2Round=1;
  $('zzBody2').style.display='none';
  $('zzCounter2').style.display='block';
  updateZzCounter2(1);
  const tick=()=>{
    zzAnim2Round=Math.min(zzAnim2Round+1, ZZ_MAX_ROUNDS);
    drawZzChart(zzAnim2Round,'zzChart2',zzLev3,zzBase3);
    updateZzCounter2(zzAnim2Round);
    if(zzAnim2Round>=ZZ_MAX_ROUNDS){ zzAnim2Timer=null; return; }
    const delay=zzAnim2Round<=6?500:zzAnim2Round<=12?300:zzAnim2Round<=25?180:100;
    zzAnim2Timer=setTimeout(tick,delay);
  };
  zzAnim2Timer=setTimeout(tick,700);
}

// ── HISTORICAL EVENTS ──
function stopEvAnim(){
  if(evAnimTimer){ clearTimeout(evAnimTimer); evAnimTimer=null; }
}

function selectEvent(id){
  const ev=HIST_EVENTS.find(e=>e.id===id);
  if(!ev) return;
  selectedEv=ev;

  document.querySelectorAll('.ev-card').forEach(c=>{
    c.classList.toggle('active', c.dataset.evId===id);
  });

  evBase=[100]; evLev=[100];
  ev.days.forEach(d=>{
    evBase.push(+(evBase[evBase.length-1]*(1+d/100)).toFixed(4));
    evLev.push(+(evLev[evLev.length-1]*(1+d*2/100)).toFixed(4));
  });

  $('evPlaceholder').style.display='none';
  $('evChartWrap').style.display='block';
  $('evEventName').textContent=ev.name+'　'+ev.period;
  $('evResult').style.display='none';

  startEvAnim(ev);

  if(window.innerWidth<=700){
    const section=document.querySelector('[data-step="20"]');
    if(section){
      const top=section.getBoundingClientRect().top+window.scrollY;
      window.scrollTo({top,behavior:'smooth'});
    }
  }
}

function startEvAnim(ev){
  stopEvAnim();
  evAnimDay=0;
  drawEvChart(0);
  updateEvStatus(ev,0);
  const n=ev.days.length;
  const delay=n>=80?45:n>=40?65:90;
  const tick=()=>{
    evAnimDay=Math.min(evAnimDay+1,n);
    drawEvChart(evAnimDay);
    updateEvStatus(ev,evAnimDay);
    if(evAnimDay<n) evAnimTimer=setTimeout(tick,delay);
    else updateEvResult();
  };
  evAnimTimer=setTimeout(tick,400);
}

function drawEvChart(day){
  const canvas=$('evChart');
  if(!canvas||!canvas.offsetWidth) return;
  const dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth,H=canvas.offsetHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);

  const bd=evBase.slice(0,day+1), ld=evLev.slice(0,day+1);
  const all=[...bd,...ld];
  const rawMin=Math.min(...all), rawMax=Math.max(...all);
  const ySpan=Math.max(rawMax-rawMin,5);
  const pad=ySpan*0.12+2;
  const minV=rawMin-pad, maxV=rawMax+pad;

  const P={t:12,r:8,b:18,l:42};
  const cw=W-P.l-P.r, ch=H-P.t-P.b;
  const n=selectedEv ? selectedEv.days.length : day||1;
  const xOf=i=>P.l+(i/n)*cw;
  const yOf=v=>P.t+ch-(v-minV)/(maxV-minV)*ch;

  ctx.clearRect(0,0,W,H);

  // Grid
  const yRange=rawMax-rawMin;
  const gs=yRange>80?20:yRange>40?10:yRange>15?5:yRange>6?2:1;
  const fg=Math.ceil(minV/gs)*gs;
  for(let v=fg;v<=maxV;v+=gs){
    const y=yOf(v); if(y<P.t-2||y>P.t+ch+2) continue;
    ctx.strokeStyle=v===100?'rgba(255,255,255,.14)':'rgba(255,255,255,.05)';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(P.l,y);ctx.lineTo(P.l+cw,y);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.22)';ctx.font='8px system-ui';ctx.textAlign='right';
    ctx.fillText(Math.round(v),P.l-3,y+3);
  }

  // 100 baseline
  ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(P.l,yOf(100));ctx.lineTo(P.l+cw,yOf(100));ctx.stroke();
  ctx.setLineDash([]);

  // Lines
  function line(data,color){
    if(data.length<1) return;
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.lineJoin='round';
    ctx.beginPath();data.forEach((v,i)=>i===0?ctx.moveTo(xOf(i),yOf(v)):ctx.lineTo(xOf(i),yOf(v)));
    if(data.length>1) ctx.stroke();
    const last=data[data.length-1];
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(xOf(data.length-1),yOf(last),3,0,Math.PI*2);ctx.fill();
  }

  line(bd,'#3dd68c');
  line(ld,'#4f8ef7');
}

function updateEvStatus(ev,day){
  const bv=evBase[day]||100, lv=evLev[day]||100;
  const bp=(bv/100-1)*100, lp=(lv/100-1)*100;
  $('evDay').textContent=`第 ${day} 天 / 共 ${ev.days.length} 天`;
  $('evBaseVal').textContent=bv.toFixed(1)+' 萬';
  $('evBasePct').textContent=fmtP(bp); $('evBasePct').style.color=pClr(bp);
  $('evLevVal').textContent=lv.toFixed(1)+' 萬';
  $('evLevPct').textContent=fmtP(lp); $('evLevPct').style.color=pClr(lp);
}

function updateEvResult(){
  const bv=evBase[evBase.length-1], lv=evLev[evLev.length-1];
  const bp=(bv/100-1)*100, lp=(lv/100-1)*100;
  const diff=lv-bv;
  const absDiff=Math.abs(diff).toFixed(1);
  const sign=diff>=0?'+':'-';
  const ppDiff=Math.abs(lp-bp).toFixed(1);
  $('evResultContent').innerHTML=`
    <div class="ev-result-row">
      <span style="color:var(--green)">0050</span>
      <span style="color:${bp>=0?'var(--green)':'var(--red)'};font-weight:700">
        ${bv.toFixed(1)} 萬&nbsp;(${fmtP(bp)})
      </span>
    </div>
    <div class="ev-result-row">
      <span style="color:var(--blue)">正 2</span>
      <span style="color:${lp>=0?'var(--green)':'var(--red)'};font-weight:700">
        ${lv.toFixed(1)} 萬&nbsp;(${fmtP(lp)})
      </span>
    </div>
    <div class="ev-result-diff">
      正 2 相對 0050：${sign}${absDiff} 萬（${sign}${ppDiff}pp）
    </div>`;
  $('evResult').style.display='block';
}

// ── CHOICE ──
function makeChoice(choice){
  userChoice=choice;
  $('postChoice').style.display='block';

  const levName=choice==='lev'?'你':'小華';
  const baseName=choice==='lev'?'小華':'你';
  document.querySelectorAll('.lev-name').forEach(el=>el.textContent=levName);
  document.querySelectorAll('.base-name').forEach(el=>el.textContent=baseName);

  document.querySelectorAll('.if-lev').forEach(el=>el.style.display=choice==='lev'?'block':'none');
  document.querySelectorAll('.if-base').forEach(el=>el.style.display=choice==='base'?'block':'none');

  setTimeout(()=>document.querySelector('[data-step="5"]').scrollIntoView({behavior:'smooth'}),300);

  cur=-1;
  updateViz(4);
}

// ── OBSERVER ──
const sections=document.querySelectorAll('.scroll-section');
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) updateViz(+e.target.dataset.step);
  });
},{rootMargin:'-40% 0px -40% 0px'});
sections.forEach(s=>io.observe(s));

updateViz(0);

window.addEventListener('resize',()=>{
  if(cur>=1&&cur<=7) drawVerticalBars(cur);
  if(cur>=8&&cur<=12) drawMainChart(cur-2);
  if(cur>=13&&cur<=17){ const r=cur===17?zzAnimRound:cur-13; drawZzChart(r); }
  if(cur>=18&&cur<=19){ const r=cur===19?zzAnim2Round:1; drawZzChart(r,'zzChart2',zzLev3,zzBase3); }
  if(cur>=20&&selectedEv) drawEvChart(evAnimDay);
});
