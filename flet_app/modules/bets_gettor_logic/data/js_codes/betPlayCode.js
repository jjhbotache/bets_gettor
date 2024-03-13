// betPlayCode.js
// javascript code to bet on betplay
//
//
let searchedName = '<<name>>';
const amountToBet = '<<amount>>';
// let searchedName = 'Draw';
// const amountToBet = 50000;
searchedName = searchedName.toLowerCase().trim() === "draw" ? "empate" : searchedName;
async function main() {

// press al the btns with this class mod-KambiBC-betslip-outcome__close-btn
const closeBetButtons = document.querySelectorAll('button[type="button"].mod-KambiBC-betslip-outcome__close-btn')
closeBetButtons.forEach(async (button) => await button.click());

const rightDiv = document.querySelector(".KambiBC-bet-offer-subcategory__container")
const oddBtns = Array.from(rightDiv.querySelectorAll("button"))
// sort them by similarity with the searched name
oddBtns.sort((a, b) => {
    const aName = a.textContent.slice(0,-4).trim();
    const bName = b.textContent.slice(0,-4).trim();
    const aSimilarity = levenshteinDistance(aName, searchedName);
    const bSimilarity = levenshteinDistance(bName, searchedName);
    return aSimilarity - bSimilarity;
})
// get the first one and click it
oddBtns[0].click();


const interval = setInterval(async () => {
    const input = await lookForInput();
    if (input) {
        clearInterval(interval);
        let input = document.querySelector(".mod-KambiBC-stake-input")
        let newInput = input.cloneNode(true)
        newInput.value = amountToBet
        input.replaceWith(newInput)
    }
 }, 500);

 async function lookForInput() {
    console.log("looking for input");
    try {
       // get the input
       let input = document.querySelector(".mod-KambiBC-stake-input.mod-KambiBC-js-stake-input.mod-KambiBC-stake-input--display-currency");
       // if the input is undefined, throw an error to go to the catch
       if (!input) throw new Error();
       return input;
    } catch (error) {
       console.log("input not found");
       // if the input is undefined, the interval will continue to check
    }
 }


    
}
main();

function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
     matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
     matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
     for (let j = 1; j <= a.length; j++) {
         const cost = a[j - 1] === b[i - 1] ? 0 : 1;
         matrix[i][j] = Math.min(
             matrix[i - 1][j] + 1, // Eliminación
             matrix[i][j - 1] + 1, // Inserción
             matrix[i - 1][j - 1] + cost // Sustitución
         );
     }
  }
  return matrix[b.length][a.length];
}