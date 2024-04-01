/**
 * Organize an array of strings by similarity to a given string using Levenshtein distance
 * @param {string[]} strings
 * @param {string} a
 * @returns {string[]}
 */
function organizeByLevenshteinDistance(strings, a) {
  function levenshteinDistance(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array.from({ length: n + 1 }, () => 0));

    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }

    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
  }

  return strings.sort((x, y) => {
    const xDist = levenshteinDistance(x, a);
    const yDist = levenshteinDistance(y, a);
    return xDist - yDist;
  });
}






const option = 'OPTION'
const amount = 'AMOUNT'
console.log(`
betting in betplay for option: ${option} and amount: ${amount}	
`)

const btn_container = document.querySelector('.KambiBC-outcomes-list.KambiBC-outcomes-list--layout-grid.KambiBC-outcomes-list--columns-3')

const options = []
const btns = btn_container.querySelectorAll('button')

btns.forEach(btn => {
  options.push({
    btn: btn,
    name: btn.querySelector('div>div>div').textContent,
  })
})

const sortedOptions = organizeByLevenshteinDistance(options.map(o => o.name), option )
const btn_to_click = options.find(o => o.name === sortedOptions[0]).btn
btn_to_click.click()

async function putAmount() {
  // try to put amount until success

  await new Promise(
    (r) => {
      const interval = setInterval(() => {
        console.log('putting amount');
        const amount_input = document.querySelector('.mod-KambiBC-stake-input.mod-KambiBC-js-stake-input.mod-KambiBC-stake-input--display-currency')
        if(amount_input){
          amount_input.focus()
          clearInterval(interval)
          r()
        }
      }, 500)
    }
  )


  await new Promise(
    (r) => {
      const interval = setInterval(() => {
        console.log('clicking place bet');
        const place_bet_btn = document.querySelector('.mod-KambiBC-betslip__place-bet-btn')
        if(place_bet_btn){
          place_bet_btn.click()
          clearInterval(interval)
          r()
        }
      }, 500)
    }
  )
  
}
putAmount()



console.log(options);