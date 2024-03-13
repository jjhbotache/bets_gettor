// wPlayCode.js
// javascript code to bet on wplay
//
//

// let searchedName = '<<name>>';
// const amountToBet = '<<amount>>';
let searchedName = prompt("Ingrese el nombre del equipo al que desea apostar");
const amountToBet = parseInt(prompt("Ingrese el monto a apostar"));
// let searchedName = 'Draw';
// const amountToBet = 50000;
searchedName = searchedName.toLowerCase().trim() === "draw" ? "empate" : searchedName;

async function main(){
   const closeBetButtons =document.querySelectorAll('button[type="button"][title="x"][name="remove-bet"].delete').forEach(async(button )=>await button.click());
   const buttonsWithTiltle = document.querySelectorAll("button[title].price");
   const rightBtn = sortButtonsBySimilarity(buttonsWithTiltle, searchedName)[0];

   const rightName = rightBtn.title.trim();
   rightBtn.click();
   
   const interval = setInterval(async () => {
      const input = await lookForInput();
      if (input) {
         clearInterval(interval);
         input.value = amountToBet;
      }
   }, 500);
}
main();




// get the input and set the amount to bet

// create an interval to look for the input, and clear it when the input is found

// function to look for the input
async function lookForInput() {
   console.log("looking for input");
   try {
      // get the input
      const input = document.querySelector("input[type=text].stake");
      // if the input is undefined, throw an error to go to the catch
      if (!input) throw new Error();
      return input;
   } catch (error) {
      console.log("input not found");
      // if the input is undefined, the interval will continue to check
   }
}
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
function sortButtonsBySimilarity(buttons,searchedName) {
const buttonsWithDistance = [];
for (const button of buttons) {
   const distance = levenshteinDistance(button.title.trim(), searchedName);
   buttonsWithDistance.push({ button, distance });
}
const sortedButtons = buttonsWithDistance.sort((a, b) => a.distance - b.distance);
return sortedButtons.map((btn) => btn.button);
}
