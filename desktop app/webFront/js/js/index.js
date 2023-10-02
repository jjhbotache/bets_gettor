import { apiRoute, defaultBetAmount } from "../consts.js";
import { addDots, importElement } from "../functions.js";

window.addEventListener("load",()=>{
window.addEventListener("pywebviewready",()=>{
// ========================================================================================================================



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

let surebetsPeriod = [];

let avgPeriodSegs, maxPeriodSegs, minPeriodSegs;

// ---------------------------------------------------
// Verificamos si el navegador admite las notificaciones
// window.addEventListener("load",()=>{
// window.addEventListener("pywebviewready",()=>{

inputBetAmount.addEventListener('blur', render);

window.addEventListener('click', e => {
  if(['BODY', 'MAIN'].includes(e.target.tagName)){
    surebetOnViewer = null;
    render();
  }
})

function render() {
  console.log("-------------");
  // if there is a surebet on viewer (just one)
  let borderSetter;
  if (surebetOnViewer !== null) {
    // erase the borders classes
    borderSetter = setInterval(() => {
      surebetOnViewer || (clearInterval(borderSetter));
      for (let i = 0; i < 6; i++) {
        document.querySelector('#oneSureBetViewer #cardViewer').classList.remove(`border-${i}`);
      }
      const surebetPeriod = surebetsPeriod.filter(surebetPeriod => {
        const surebetName = `${surebetOnViewer.options[0].name} VS ${surebetOnViewer.options[2].name}`;
        return surebetPeriod.name === surebetName
      })[0];
      if (surebetPeriod !== undefined) {
        surebetPeriod.endTime = new Date().getTime();
        surebetPeriod.period = surebetPeriod.endTime - surebetPeriod.startTime;
        const currentExistingTime = surebetPeriod.period / 1000;

        // update timeer
        document.querySelector('#oneSureBetViewer #duration').textContent = Math.floor(currentExistingTime); 

        // actualize the border tickness according to the time
        if (currentExistingTime < minPeriodSegs) {
          document.querySelector('#oneSureBetViewer #cardViewer').classList.add(`border-5`);
        } else if (currentExistingTime < avgPeriodSegs) {
          document.querySelector('#oneSureBetViewer #cardViewer').classList.add(`border-3`);
        }else if (currentExistingTime < maxPeriodSegs) {
          document.querySelector('#oneSureBetViewer #cardViewer').classList.add(`border-2`);
        }else if (currentExistingTime > maxPeriodSegs) {
          document.querySelector('#oneSureBetViewer #cardViewer').classList.add(`border-1`);
        }

      }
    }, 250);
    

    // verify if the surebetOnViewer exists in the surebets array
    const onViewerName = `${surebetOnViewer.options[0].name} VS ${surebetOnViewer.options[2].name}`;
    const sameSurebet = surebets.filter(surebet => {
      const surebetName = `${surebet.options[0].name} VS ${surebet.options[2].name}`;
      console.log(surebetName);
      console.log(onViewerName);
      console.log(surebet.info.profit != surebetOnViewer.info.profit );
      return (surebetName === onViewerName) 
    })[0]

    // if the surebet exists, actualize the color to alert the user if it still exists
    if (sameSurebet !== undefined) { // if the surebet exists
      document.querySelector('#oneSureBetViewer #cardViewer').classList.add('border-primary');
      document.querySelector('#oneSureBetViewer #cardViewer').classList.remove('border-danger');
      surebetOnViewer = sameSurebet;
    }else{ // if the surebet doesn't exists
      console.log("no hay surebet igual");
      document.querySelector('#oneSureBetViewer #cardViewer').classList.remove('border-primary');
      document.querySelector('#oneSureBetViewer #cardViewer').classList.add('border-danger');
    }
    
    // show the surebet on viewer window
    document.getElementById('oneSureBetViewer').classList.remove('d-none');
    document.querySelector("main").parentElement.classList.add('col-sm-6');

    // set the title
    document.querySelector('#oneSureBetViewer .card-title').textContent = `${surebetOnViewer.options[0].name} VS ${surebetOnViewer.options[2].name}`;



    // set the raw info
    // and links
    surebetOnViewer.totalBet = 0;
    for (let i = 1; i < 4; i++) {
      const sub = document.querySelector(`#sb${i}`)
      sub.querySelector('.team').textContent = surebetOnViewer.options[i-1].name.split(" ")[0];
      sub.querySelector('.bookmaker').textContent = surebetOnViewer.options[i-1].bookmaker.name;
      sub.querySelector('.odd').textContent = surebetOnViewer.options[i-1].odd;
      
      const priceToBet = inputBetAmount.value * (parseFloat(surebetOnViewer.options[i - 1].prob_impl)/surebetOnViewer.info.sum);
      sub.querySelector('.exact-price').textContent = priceToBet;
      
      const normalized = document.querySelector(`#normalized${i}`)
      normalized.querySelector('.n_team').textContent = surebetOnViewer.options[i-1].name.split(" ")[0];
      normalized.querySelector('.n_bookmaker').textContent = surebetOnViewer.options[i-1].bookmaker.name;
      const normalizedBetPrice = Math.floor(priceToBet / 100) * 100;
      normalized.querySelector('.odd').textContent = surebetOnViewer.options[i-1].odd;

      normalized.querySelector('.n_odd').textContent = normalizedBetPrice;
      normalized.querySelector('.n_odd').addEventListener('click', e=>{
        pywebview.api.copy_to_clipboard(normalizedBetPrice);
        
      })
      surebetOnViewer.totalBet += normalizedBetPrice;

      // setting the links
      const enlace = surebetOnViewer.options[i - 1].link.trim();
      const expresionRegular = /^(https?:\/\/)?[^\s]+\.[^\s]/;

      const link = document.querySelector(`#link${i} a`);
      if (expresionRegular.test(enlace)) {
        link.href = surebetOnViewer.options[i-1].link;
        link.textContent = surebetOnViewer.options[i-1].link;
        link.target = "_blank";

        link.addEventListener('click', e=>{
          pywebview.api.copy_to_clipboard(normalizedBetPrice);
        })

        link.classList.add('text-primary');
        link.classList.remove('text-light');
        
      }else{
        const to_search = surebetOnViewer.options[i-1].link;
        const newLink = "https://m.codere.com.co/deportescolombia/#/HomePage";
        link.innerHTML = "CODERE: "+ to_search;
        link.innerHTML = `
        <span  class="btn btn-outline-success">
          <strong>CODERE:</strong> ${to_search}
        </span>
        `;
        link.querySelector(`span`).addEventListener('click',e=>{
          e.preventDefault();
          pywebview.api.copy_to_clipboard(to_search);
          window.open(newLink, '_blank');
          navigator.clipboard.writeText(to_search);
        }
        )
      }

      const button = document.querySelector(`#link${i} button`);
      // setting the code to the button
      button.textContent = " js code";
      button.addEventListener('click', e=>{
        console.log(surebetOnViewer.options[i-1].code);
        pywebview.api.copy_to_clipboard(surebetOnViewer.options[i-1].code);
      })

    }
    const finalDiv = document.querySelector(`#finalInfo`);
    finalDiv.querySelector('h3').textContent = `Bet: ${surebetOnViewer.totalBet}`;
    let smallestProfit = 0;

    for (let i = 0; i < 3; i++) {
      const amountToBet = Math.floor((inputBetAmount.value * (parseFloat(surebetOnViewer.options[i].prob_impl) / surebetOnViewer.info.sum) / 100)) * 100;
      const profit = amountToBet * surebetOnViewer.options[i].odd;

      if (profit < smallestProfit || smallestProfit === 0) { smallestProfit = profit; }

      finalDiv.querySelector(`#i${i+1}`).textContent = `Proces (${i}opt win): 
      Real bet:${surebetOnViewer.totalBet}
      Real Price to bet: ${amountToBet}
      Profit: ${profit}
      `;
    }

    const realProfit = smallestProfit - surebetOnViewer.totalBet;

    // debugger;
    try {
      const profitSpan = finalDiv.querySelector('span');
      profitSpan.textContent = `Profit: ${realProfit}`;
      profitSpan.classList.remove('bg-success');
      profitSpan.classList.remove('bg-danger');
      realProfit > 0 ? profitSpan.classList.add('bg-success') : profitSpan.classList.add('bg-danger');
      
    } catch (error) {
      console.log(error);      
    }

  }else{
    clearInterval(borderSetter);
    document.getElementById('oneSureBetViewer').classList.add('d-none');
    document.querySelector("main").parentElement.classList.remove('col-sm-6');
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

  periodsLogger();

  renderPeriodsInfo();
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
      render();
    });

    div.querySelector('.time').textContent = surebet.info.time
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

    
    surebets = [
      {
          "info": {
              "is_surebet": true,
              "profit": 15.69282136894823,
              "sum": 0.8643578643578644,
              "time": " 06:00"
          },
          "options": [
              {
                  "bookmaker": {
                      "id": 3,
                      "name": "codere"
                  },
                  "code": "alert('hi')",
                  "link": "ES Sétif S21 - MC El Bayadh S21",
                  "name": "MC El Bayadh S21",
                  "odd": 9,
                  "prob_impl": 0.1111111111111111
              },
              {
                  "bookmaker": {
                      "id": 3,
                      "name": "codere"
                  },
                  "code": "alert('hi')",
                  "link": "ES Sétif S21 - MC El Bayadh S21",
                  "name": "Draw",
                  "odd": 5.5,
                  "prob_impl": 0.18181818181818182
              },
              {
                  "bookmaker": {
                      "id": 1,
                      "name": "wplay"
                  },
                  "code": "alert('hi')",
                  "link": "https://apuestas.wplay.co/es/e/19777804",
                  "name": "ES Setif U21",
                  "odd": 1.75,
                  "prob_impl": 0.5714285714285714
              }
          ],
          "totalBet": 6400
      }
    ]
    // surebets = data;

    // sort them by biggest profit
    surebets.sort((a, b) => b.info.profit - a.info.profit);
    
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

function periodsLogger(working=false){
  // for each surebet gotten
  surebets.forEach(surebet => {
    const surebetName = `${surebet.options[0].name} VS ${surebet.options[2].name}`;
    // if the surebet doesn't exists in the array, is new
    if (!surebetsPeriod.some(surebetPeriod => surebetPeriod.name === surebetName)) {
      // then, add it
      surebetsPeriod.push({
        name: surebetName,
        startTime: new Date().getTime(),
      })
    }

    // for each surebet period, if doesn't was bringed, calculate the time and add it
    
    
  });
  surebetsPeriod.forEach((surebetPeriod,i) => {
    if (!surebets.some(surebet => (
      `${surebet.options[0].name} VS ${surebet.options[2].name}` === surebetPeriod.name
    ))){
      surebetPeriod.endTime = new Date().getTime();
      surebetPeriod.period = surebetPeriod.endTime - surebetPeriod.startTime;
      working && pywebview.api.write_duration(surebetPeriod.period/1000);
      surebetsPeriod.splice(i,1);
    }
  })
}



const periodAvg = document.getElementById("periodAvg");
const periodMax = document.getElementById("periodMax");
const periodMin = document.getElementById("periodMin");

function renderPeriodsInfo() {
  pywebview.api.get_durations().then((list) => {
    avgPeriodSegs = Math.round(list.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / list.length);
    maxPeriodSegs = Math.round(Math.max(...list));
    minPeriodSegs = Math.round(Math.min(...list));
    
    periodAvg.textContent = avgPeriodSegs;
    periodMax.textContent = maxPeriodSegs;
    periodMin.textContent = minPeriodSegs;
  })
}

// ========================================================================================================================
})
})