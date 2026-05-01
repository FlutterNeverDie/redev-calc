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

// ── 투자금 분석 ─────────────────────────────
function fmtMan(n) {
  if (n === null || isNaN(n)) return '-';
  return Math.round(n).toLocaleString('ko-KR') + '만원';
}

function calcInvest() {
  var appraisal = parseFloat(document.getElementById('investAppraisal').value.replace(/,/g, ''));
  var sale = parseFloat(document.getElementById('investSale').value.replace(/,/g, ''));
  var deposit = parseFloat(document.getElementById('investDeposit').value.replace(/,/g, ''));
  var loanRate = parseFloat(document.getElementById('investLoanRate').value);

  var elPremium = document.getElementById('investPremium');
  var elCash = document.getElementById('investCash');
  var elMigration = document.getElementById('investMigration');
  var elAfterLoan = document.getElementById('investAfterLoan');

  if (!sale || isNaN(sale)) {
    elPremium.textContent = '-';
    elCash.textContent = '-';
    elMigration.textContent = '-';
    elAfterLoan.textContent = '-';
    return;
  }

  // 프리미엄 = 매매금액 - 감정가
  if (appraisal) {
    elPremium.textContent = fmtMan(sale - appraisal);
  } else {
    elPremium.textContent = '-';
  }

  // 현금투자액 = 매매금액 - 보증금액
  if (deposit) {
    elCash.textContent = fmtMan(sale - deposit);
  } else {
    elCash.textContent = fmtMan(sale);
  }

  // 이주비대출 가능액 = 감정가 × 비율
  if (appraisal && loanRate) {
    var migration = appraisal * loanRate / 100;
    elMigration.textContent = fmtMan(migration);
    // 이주비대출후 투자금 = 매매가 - 이주비대출액
    elAfterLoan.textContent = fmtMan(sale - migration);
  } else {
    elMigration.textContent = '-';
    elAfterLoan.textContent = '-';
  }
}
