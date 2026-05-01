// ── 대출 시뮬레이션 ─────────────────────────

function fmtLoan(n) {
  if (!n || isNaN(n)) return '-';
  return Math.round(n).toLocaleString('ko-KR') + '원';
}

function updateLoanAmount() {
  var typeIdx = document.getElementById('loanType').value;
  var ratioVal = document.getElementById('loanRatio').value;
  if (typeIdx === '') return;
  var myV = getInputVal();
  if (!myV) return;

  var jo = priceData[parseInt(typeIdx)][1];
  var r;
  if (ratioVal === 'custom') {
    r = getCustomRatio();
    if (!r) return;
  } else {
    r = parseFloat(ratioVal);
  }
  var burden = jo - myV * r;
  if (burden < 0) burden = 0;
  var el = document.getElementById('loanAmount');
  el.value = Math.round(burden).toLocaleString('ko-KR');
  calcLoan();
}

function calcLoan() {
  var rawAmt = document.getElementById('loanAmount').value.replace(/,/g, '');
  var P = parseFloat(rawAmt);
  var rateRaw = parseFloat(document.getElementById('loanRate').value);
  var termVal = document.getElementById('loanTerm').value;
  var years = termVal === 'custom' ? parseInt(document.getElementById('loanTermCustom').value) : parseInt(termVal);

  var elMonthly = document.getElementById('loanMonthly');
  var elTotal = document.getElementById('loanTotal');
  var elInterest = document.getElementById('loanInterest');

  if (!P || P <= 0 || isNaN(rateRaw) || !years) {
    elMonthly.textContent = '-';
    elTotal.textContent = '-';
    elInterest.textContent = '-';
    return;
  }

  var monthlyRate = rateRaw / 100 / 12;
  var n = years * 12;

  var monthly;
  if (monthlyRate === 0) {
    monthly = P / n;
  } else {
    monthly = P * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
  }

  var total = monthly * n;
  var interest = total - P;

  elMonthly.textContent = fmtLoan(monthly);
  elTotal.textContent = fmtLoan(total);
  elInterest.textContent = fmtLoan(interest);
}
