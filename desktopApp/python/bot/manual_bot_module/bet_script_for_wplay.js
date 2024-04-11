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
const amount = "AMOUNT"


console.log(`betting ${amount} on ${option}`);

const expanders = document.querySelectorAll('div.efav-section.mkt.expander');
// find the expander that has a H6 with the expander-MSMRES class
const expander = Array.from(expanders).find(expander => expander.querySelector('h6.expander-MSMRES'));

const optionBtns = Array.from(expander.querySelectorAll('button'));

const organizedOptions = optionBtns.sort((a, b) => (
  levenshteinDistance(a.title, option) - levenshteinDistance(b.title, option)
));

organizedOptions[0].click();

// allow odd changes
setTimeout(() => {
  document.querySelector("input#prc_change_policy_ALLOW_ALL").checked = true;
  document.querySelector("input.stake").value = parseInt(amount);
  document.querySelector("button[name=place_slip]").click()
}, 1000);

