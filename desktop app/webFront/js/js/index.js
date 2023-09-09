import { apiRoute, defaultBetAmount } from "../consts.js";
import { addDots, importElement } from "../functions.js";


let surebetElementTemplate;
importElement('templates/surebet.html').then(element => {
  // crea un template y le appendea el elemento
  // luego agrega el template al body
  console.log(element);
  // create a template with the id "surebetTemplate" and append the template element to the body
  const template = document.createElement('template');
  template.appendChild(element);
  template.id = "surebetTemplate";
  surebetElementTemplate = template;

  document.body.appendChild(template);


})


// elements
const inputBetAmount = document.getElementById('inputBetAmount');
const divSurebets = document.getElementById('surebets_container');
const divMainInfoContainer = document.getElementsByClassName('main_info_container')[0];
// globals
let surebets = [];
let loading = false;
let surebets_amount = 0;
inputBetAmount.value = defaultBetAmount;

let surebetOnViewer = null;



// ---------------------------------------------------
// Verificamos si el navegador admite las notificaciones
// window.addEventListener("load",()=>{
// window.addEventListener("pywebviewready",()=>{

inputBetAmount.addEventListener('blur', render);

window.addEventListener('click', e => {
  ['BODY', 'MAIN'].includes(e.target.tagName) && (surebetOnViewer = null);
})

function render() {
  if (surebetOnViewer !== null) {
    document.getElementById('oneSureBetViewer').classList.remove('d-none');
    document.querySelector("main").parentElement.classList.add('col-xs-6');

    document.querySelector('#oneSureBetViewer .card-title').textContent = `${surebetOnViewer.options[0].name} 
    VS 
    ${surebetOnViewer.options[2].name}`;
    surebetOnViewer.totalBet = 0;
    for (let i = 1; i < 4; i++) {
      const sub = document.querySelector(`#sb${i}`)
      sub.querySelector('.team').textContent = surebetOnViewer.options[i-1].name.split(" ")[0];
      sub.querySelector('.bookmaker').textContent = surebetOnViewer.options[i-1].bookmaker.name;
      sub.querySelector('.odd').textContent = surebetOnViewer.options[i-1].odd;
      const priceToBet = inputBetAmount.value * parseFloat(surebetOnViewer.options[i - 1].prob_impl);
      sub.querySelector('.exact-price').textContent = priceToBet;
      
      const normalized = document.querySelector(`#normalized${i}`)
      normalized.querySelector('.n_team').textContent = surebetOnViewer.options[i-1].name.split(" ")[0];
      normalized.querySelector('.n_bookmaker').textContent = surebetOnViewer.options[i-1].bookmaker.name;
      const normalizedBetPrice = Math.floor(priceToBet / 100) * 100;
      normalized.querySelector('.n_odd').textContent = normalizedBetPrice;
      normalized.querySelector('.n_odd').addEventListener('click', e=>{
        pywebview.api.copy_to_clipboard(normalizedBetPrice);
        
      })
      surebetOnViewer.totalBet += normalizedBetPrice;

      if ((surebetOnViewer.options[i-1].link).includes("htt")) {
        document.querySelector(`#link${i}`).querySelector("a").href = surebetOnViewer.options[i-1].link;
        document.querySelector(`#link${i}`).querySelector("a").textContent = surebetOnViewer.options[i-1].link;
        document.querySelector(`#link${i}`).querySelector("a").target = "_blank";

        document.querySelector(`#link${i}`).querySelector("a").addEventListener('click', e=>{
          pywebview.api.copy_to_clipboard(normalizedBetPrice);
          pywebview.api.create_notification("price copied to clipboard", normalizedBetPrice, 2000);
          
        })
      }else{
        const to_search = surebetOnViewer.options[i-1].link;
        const newLink = "https://m.codere.com.co/deportescolombia/#/HomePage";
        document.querySelector(`#link${i}`).innerHTML = `
        <a  id="link" class="text-light">
          <strong>CODERE:</strong> ${to_search}
        </a>
        `;
        document.querySelector(`#link${i} a`).addEventListener('click',e=>{
          e.preventDefault();
          pywebview.api.copy_to_clipboard(to_search);
          pywebview.api.create_notification("event to search copied", to_search, 2000);
          window.open(newLink, '_blank');
          navigator.clipboard.writeText(to_search);
        })

      }

    }
    const finalDiv = document.querySelector(`#finalInfo`);
    finalDiv.querySelector('h3').textContent = `Bet: ${surebetOnViewer.totalBet}`;
    for (let i = 0; i < 3; i++) {
      finalDiv.querySelector(`#i${i+1}`).textContent = `Proces (${i}opt win): 
      Real bet:${surebetOnViewer.totalBet}
      Real Price to bet: ${Math.floor(inputBetAmount.value * parseFloat(surebetOnViewer.options[i].prob_impl)/ 100) * 100}
      Profit: ${Math.floor(inputBetAmount.value * parseFloat(surebetOnViewer.options[i].prob_impl)/ 100) * 100 * surebetOnViewer.options[i].odd}
      `;
    }

    const realProfit =
    
     (
      Math.floor(inputBetAmount.value * parseFloat(surebetOnViewer.options[0].prob_impl)/ 100) * 100 // price to bet normalized
       *
      surebetOnViewer.options[0].odd // odd
       )
       -
        surebetOnViewer.totalBet // bet

    const profitSpan = finalDiv.querySelector('span');
    profitSpan.textContent = `Profit: ${realProfit}`;
    realProfit > 0 ? profitSpan.classList.add('bg-success') : profitSpan.classList.add('bg-danger');

  }else{
    document.getElementById('oneSureBetViewer').classList.add('d-none');
    document.querySelector("main").parentElement.classList.remove('col-xs-6');
  }

  if(loading){
    divMainInfoContainer.classList.add('border-warning');
    divMainInfoContainer.classList.remove('border-primary')
  }else{
    divMainInfoContainer.classList.remove('border-warning');
    divMainInfoContainer.classList.add('border-primary')
    divSurebets.innerHTML = ``;
  }

  if (surebets.length === 0){
    divSurebets.innerHTML = ` <div class="spinner-border text-warning m-auto d-block" role="status"> `;
  }else{
    onSurebets();
  }

}
render();

function onSurebets() {
  if (surebets_amount < surebets.length) {
    surebets_amount = surebets.length;
    console.log('surebets_amount', surebets_amount);
    
    const biggerSurebet = surebets.sort((a, b) => b.info.profit - a.info.profit)[0];
    pywebview.api.create_notification("New surebet found!", 
    Math.round(biggerSurebet.info.profit)+"%"+ " is the bigger profit"+(Math.round(biggerSurebet.info.profit)>20?"!!":""), 5000)
  }
  divSurebets.innerHTML = "";
  surebets.forEach(surebet => {
    const clone = document.importNode(surebetElementTemplate, true);
    const div = clone.querySelector('div');

    div.addEventListener('click', e => {
      // save in localStorage the surebet
      // localStorage.setItem('surebet', JSON.stringify(surebet));
      // window.location.href = "surebetView.html";
      surebetOnViewer = surebet;
    });

    div.querySelector('.title').textContent = `${surebet.options[0].name} VS ${surebet.options[2].name}`;
    div.querySelector('.profit').textContent = `Profit:  ${Math.round(surebet.info.profit)}%`;
    div.querySelector('.betProfit').textContent = `Profit according to bet:  $${addDots(Math.round((surebet.info.profit / 100) * inputBetAmount.value))}`;

    // console.log(div);
    divSurebets.appendChild(div);
    return;



  });
}


function fetching() {
  loading = true;
  let timeToWait;
  render();
  fetch(apiRoute+"/sure_bets")
  .then(res => res.json())
  .then(data => {
    data.length === 0 ? (timeToWait = 100) : (timeToWait = 500);

    
    surebets = data;
    // surebets = [
    //   {
    //       "info": {
    //           "is_surebet": true,
    //           "prob_imp_d": 0.2777777777777778,
    //           "prob_imp_t1": 0.16666666666666666,
    //           "prob_imp_t2": 0.3802281368821293,
    //           "profit": 21.26024590163935,
    //           "sum": 0.8246725813265737
    //       },
    //       "options": [
    //           {
    //               "bookmaker": {
    //                   "id": 1,
    //                   "name": "wplay"
    //               },
    //               "name": "Deportivo Coopsol",
    //               "odd": 6
    //           },
    //           {
    //               "bookmaker": {
    //                   "id": 1,
    //                   "name": "wplay"
    //               },
    //               "name": "Draw",
    //               "odd": 3.6
    //           },
    //           {
    //               "bookmaker": {
    //                   "id": 2,
    //                   "name": "betplay"
    //               },
    //               "name": "Unión Huaral",
    //               "odd": 2.63
    //           }
    //       ]
    //   }
    // ];

    console.log(surebets);
  })
  .finally(() => {
    loading = false;
    render();
    setTimeout(() => {
      fetching()
    }, timeToWait);
  })
}
fetching();


// })
// })