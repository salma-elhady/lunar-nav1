const sites = {
  ridge: {name:"Ridge Alpha", pin:"A", sunlight:78, elevation:8.4, earth:85, tradeoff:"Higher exposure; terrain needs validation"},
  crater: {name:"Crater Rim Beta", pin:"B", sunlight:53, elevation:4.1, earth:62, tradeoff:"Potential shadowing near rim"},
  plain: {name:"South Plain Gamma", pin:"C", sunlight:66, elevation:6.2, earth:74, tradeoff:"More open terrain; verify horizon"}
};
const siteEl=document.getElementById("site"), timeEl=document.getElementById("time"), dateEl=document.getElementById("missionDate");
function renderChart(site){
  const chart=document.getElementById("chart"); chart.innerHTML="";
  for(let h=0;h<24;h++){
    const g=document.createElement("div");g.className="bar-group";
    const sun=document.createElement("div");sun.className="bar sun";
    const earth=document.createElement("div");earth.className="bar earth";
    // Smooth illustrative patterns only, not lunar ephemeris.
    const s=Math.max(7,Math.min(95,site.sunlight*(0.42+0.58*Math.sin((h/24)*Math.PI*2-Math.PI/2+0.5))));
    const e=Math.max(20,Math.min(95,site.earth*(0.78+0.18*Math.sin((h/24)*Math.PI*2+0.8))));
    sun.style.height=s+"%";earth.style.height=e+"%";
    g.append(sun,earth);
    if(h%3===0){const lab=document.createElement("label");lab.textContent=String(h).padStart(2,"0");g.append(lab)}
    chart.append(g);
  }
}
function update(){
  const site=sites[siteEl.value],hour=Number(timeEl.value);
  document.getElementById("timeLabel").textContent=String(hour).padStart(2,"0")+":00";
  const angle=Math.max(-4,site.elevation*Math.sin(((hour-6)/12)*Math.PI));
  const illum=Math.round(Math.max(0,Math.min(100,site.sunlight*(0.45+0.55*Math.sin((hour/24)*Math.PI*2-Math.PI/2+0.5)))));
  const earthVisible=(hour>=3&&hour<=20)?site.earth:Math.round(site.earth*.55);
  document.getElementById("sunElevation").textContent=angle.toFixed(1)+"°";
  document.getElementById("illumination").textContent=illum+"%";
  document.getElementById("illumBar").style.width=illum+"%";
  document.getElementById("earthVisibility").textContent=earthVisible>=60?"VISIBLE":"LIMITED";
  document.getElementById("earthBar").style.width=earthVisible+"%";
  document.getElementById("solarPotential").textContent=illum>=65?"HIGH":illum>=35?"MODERATE":"LOW";
  document.getElementById("solarBar").style.width=illum+"%";
  document.getElementById("sitePin").textContent=site.pin;
  renderChart(site);
  const rows=document.getElementById("compareRows");rows.innerHTML="";
  Object.entries(sites).forEach(([key,s])=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${s.name}${key===siteEl.value?' <span class="pill">SELECTED</span>':''}</td><td>${s.sunlight}% <span style="color:#718096">index</span></td><td>${s.earth}% <span style="color:#718096">index</span></td><td>${s.tradeoff}</td>`;
    rows.append(tr);
  });
}
[siteEl,timeEl,dateEl].forEach(el=>el.addEventListener("input",update));
update();
