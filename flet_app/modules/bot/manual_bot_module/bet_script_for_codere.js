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


const option = "OPTION"
const amount = parseInt("AMOUNT")


const buttons_list = [
  // {
  //   option: "Option 1",
  //   btn: undefined
  // }
]

const options = Array.from( document.querySelectorAll("div.sb-live-scoreboard-sets--info span") ).map(span=>span.textContent.trim())
options.splice(1, 0, "empate")


const btns =Array.from(document.querySelector("sb-dropdown").querySelectorAll("sb-button"))

btns.forEach((btn, i)=>{
  buttons_list.push({
    option: i == 1 ? "empate" : options[i] ,
    btn: btn
  })
})


const organizedOptions = buttons_list.sort((a, b) => (
  levenshteinDistance(a.option, option) - levenshteinDistance(b.option, option)
));

organizedOptions[0].btn.click();