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

// ── STATE ──
const $=id=>document.getElementById(id);
const fmtP=v=>(v>=0?'+':'')+v.toFixed(2)+'%';
const pClr=v=>v>0?'var(--green)':v<0?'var(--red)':'var(--muted)';

let cur=-1, userChoice=null;
let zzAnimTimer=null, zzAnimRound=3;
let zzAnim2Timer=null, zzAnim2Round=1;

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

  updateChars(step);

  if(step<=7){
    showPanel('bars');
    drawVerticalBars(step);
  } else if(step<=12){
    showPanel('chart');
    drawMainChart(step-2);
    updateDrops(step);
    $('peakBox').style.display = step>=12 ? 'block' : 'none';
    if(step>=12) fillPeakBox();
  } else if(step<=17){
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
  } else {
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
  }
}

function showPanel(which){
  const bp=$('barsPanel'), cp=$('chartPanel'), zp=$('zigzagPanel'), zp2=$('zigzagPanel2');
  bp.style.display = which==='bars' ? 'block' : 'none';
  if(which==='chart'){
    cp.classList.add('on');
    requestAnimationFrame(()=>requestAnimationFrame(()=>cp.classList.add('vis')));
  } else {
    cp.classList.remove('vis');
    setTimeout(()=>cp.classList.remove('on'),400);
  }
  [['zigzag',zp],['zigzag2',zp2]].forEach(([name,panel])=>{
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

  $('youBal').innerHTML=youV.toFixed(1)+'<small style="font-size:.55em;font-weight:400"> 萬</small>';
  $('huaBal').innerHTML=huaV.toFixed(1)+'<small style="font-size:.55em;font-weight:400"> 萬</small>';
  $('youPnl').textContent=fmtP(youP); $('youPnl').style.color=pClr(youP);
  $('huaPnl').textContent=fmtP(huaP); $('huaPnl').style.color=pClr(huaP);

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

function drawVerticalBars(step){
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

  function drawBar(cx,bw,pct,barColor,lblColor){
    const y0=zeroY,yp=yOf(pct);
    const bh=Math.abs(yp-y0)||1;
    const by=pct>=0?yp:y0;
    ctx.fillStyle=pct>=0?barColor:'#f7617a';
    ctx.fillRect(cx-bw/2,by,bw,bh);
    ctx.fillStyle=lblColor;ctx.font='7px system-ui';ctx.textAlign='center';
    const lbl=(pct>0?'+':'')+pct+'%';
    ctx.fillText(lbl,cx,pct>=0?yp-4:y0+bh+9);
  }

  for(let d=1;d<=numDays;d++){
    const cx=P.l+(d-0.5)*slotW;
    const isPhaseB=d>=4&&userChoice!==null;
    if(!isPhaseB){
      drawBar(cx,slotW*0.52,BASE[d-1],'#3dd68c','rgba(255,255,255,.75)');
    } else {
      const rl=levReturns()[d-1], rb=baseReturns()[d-1];
      const subW=slotW*0.38, gap=slotW*0.07;
      drawBar(cx-subW/2-gap/2,subW,rl,'#4f8ef7','#7ab0ff');
      drawBar(cx+subW/2+gap/2,subW,rb,'#3dd68c','#7ae8b5');
    }
    ctx.fillStyle='rgba(255,255,255,.35)';ctx.font='7px system-ui';ctx.textAlign='center';
    ctx.fillText('D'+d,cx,P.t+ch+18);
  }
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
  if(cur>=18){ const r=cur===19?zzAnim2Round:1; drawZzChart(r,'zzChart2',zzLev3,zzBase3); }
});
