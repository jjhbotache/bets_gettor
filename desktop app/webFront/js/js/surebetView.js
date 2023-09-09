const surebet = JSON.parse(localStorage.getItem("surebet"));
// get from the localsotrage the surebet
window.addEventListener('click', e=>{
  if (e.target.tagName === "MAIN"){window.location.href = "index.html";}
})
if (!surebet) {
  window.location.href = "index.html"
}else{

  document.querySelector('.card-title').textContent = `${surebet.options[0].name} VS ${surebet.options[2].name}`;

  for (let i = 1; i < 4; i++) {
    document.querySelector(`#sb${i}`).textContent = `T=${surebet.options[i-1].name} \tB=${surebet.options[i-1].bookmaker.name} \tOdd${surebet.options[i-1].odd}`;
    document.querySelector(`#link${i}`).querySelector("a").href = surebet.options[i-1].link;
    document.querySelector(`#link${i}`).querySelector("a").textContent = surebet.options[i-1].link;
  }

  
}