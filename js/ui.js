// ── UI 렌더링 & 이벤트 바인딩 ──────────────────

// 평형별 체크 상태 (기본 전부 해제)
var burdenChecked = {0: false, 1: false, 2: false, 3: false, 4: false};

function render() {
  var myV = getInputVal();
  var customR = getCustomRatio();

  // 커스텀 비례율 헤더
  var hdr = document.getElementById('customRatioHeader');
  if (customR) {
    hdr.innerHTML = '<span class="ratio-label">직접입력</span>' + (customR * 100).toFixed(1) + '%';
  } else {
    hdr.innerHTML = '<span class="ratio-label">직접입력</span>-';
  }

  // 분담금 테이블
  var tbody = document.getElementById('mainBody');
  var rows = '';
  for (var i = 0; i < priceData.length; i++) {
    var name = priceData[i][0];
    var jo = priceData[i][1];
    var checked = burdenChecked[i] !== false ? 'checked' : '';
    var cells = '<td class="chk-cell"><input type="checkbox" class="burden-chk" data-row="' + i + '" ' + checked + ' />' + name + '</td><td>' + fmt(jo) + '</td>';
    for (var j = 0; j < ratios.length; j++) {
      var v = jo - myV * ratios[j];
      cells += '<td class="' + (v < 0 ? 'negative' : 'positive') + '">' + fmt(v) + '</td>';
    }
    if (customR) {
      var vc = jo - myV * customR;
      cells += '<td class="custom-col ' + (vc < 0 ? 'negative' : 'positive') + '">' + fmt(vc) + '</td>';
    } else {
      cells += '<td style="color:#9ca3af">-</td>';
    }
    var hideClass = burdenChecked[i] === false ? ' burden-unchecked' : '';
    rows += '<tr class="burden-row' + hideClass + '">' + cells + '</tr>';
  }

  // 권리가액 행
  var rCells = '<td colspan="2" style="text-align:left;font-family:\'Noto Sans KR\',sans-serif;font-weight:600;">권리가액</td>';
  for (var k = 0; k < ratios.length; k++) {
    rCells += '<td>' + fmt(myV * ratios[k]) + '</td>';
  }
  if (customR) {
    rCells += '<td class="custom-col">' + fmt(myV * customR) + '</td>';
  } else {
    rCells += '<td style="color:#9ca3af">-</td>';
  }
  rows += '<tr class="rights-row">' + rCells + '</tr>';
  tbody.innerHTML = rows;

  // 순위 표시
  var rankInfo = calcRank(myV);
  if (rankInfo && myV) {
    document.getElementById('rankPct').textContent = rankInfo.pct;
    document.getElementById('rankPct').className = 'rank-value';
    document.getElementById('rankNum').textContent = rankInfo.rank;
    document.getElementById('rankNum').className = 'rank-value';
    document.getElementById('rankRange').textContent = rankInfo.range;
    document.getElementById('rankRange').className = 'rank-value';
  } else {
    document.getElementById('rankPct').textContent = '금액을 입력하세요';
    document.getElementById('rankPct').className = 'rank-value empty';
    document.getElementById('rankNum').textContent = '-';
    document.getElementById('rankNum').className = 'rank-value empty';
    document.getElementById('rankRange').textContent = '-';
    document.getElementById('rankRange').className = 'rank-value empty';
  }
}

function fmtInput(el) {
  try {
    var pos = el.selectionStart;
    var raw = el.value.replace(/,/g, '');
    if (raw === '' || raw === '-') { render(); return; }
    var n = parseFloat(raw);
    if (!isNaN(n)) {
      var formatted = n.toLocaleString('ko-KR');
      var diff = formatted.length - el.value.length;
      el.value = formatted;
      try { el.setSelectionRange(pos + diff, pos + diff); } catch(e) {}
    }
  } catch(e) {}
  render();
}

// ── 초기화 ──────────────────────────────────
(function init() {
  // 입력 이벤트
  var myValEl = document.getElementById('myVal');
  var customRatioEl = document.getElementById('customRatio');
  ['input', 'change', 'keyup'].forEach(function(evt) {
    myValEl.addEventListener(evt, function() { fmtInput(this); });
    customRatioEl.addEventListener(evt, function() { render(); });
  });

  // 대출 평형 select 초기화
  var sel = document.getElementById('loanType');
  for (var i = 0; i < priceData.length; i++) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = priceData[i][0];
    sel.appendChild(opt);
  }

  // 대출 금액 입력 포맷팅
  document.getElementById('loanAmount').addEventListener('input', function() {
    var pos = this.selectionStart;
    var raw = this.value.replace(/,/g, '');
    if (raw === '') { calcLoan(); return; }
    var n = parseFloat(raw);
    if (!isNaN(n)) {
      var formatted = Math.round(n).toLocaleString('ko-KR');
      var diff = formatted.length - this.value.length;
      this.value = formatted;
      this.setSelectionRange(pos + diff, pos + diff);
    }
    calcLoan();
  });

  // 대출 이벤트
  document.getElementById('loanType').addEventListener('change', updateLoanAmount);
  document.getElementById('loanRatio').addEventListener('change', updateLoanAmount);
  document.getElementById('loanRate').addEventListener('input', calcLoan);

  // 투자금 분석 이벤트
  ['investAppraisal', 'investSale', 'investDeposit'].forEach(function(id) {
    document.getElementById(id).addEventListener('input', function() {
      var pos = this.selectionStart;
      var raw = this.value.replace(/,/g, '');
      if (raw === '') { calcInvest(); return; }
      var n = parseFloat(raw);
      if (!isNaN(n)) {
        var formatted = Math.round(n).toLocaleString('ko-KR');
        var diff = formatted.length - this.value.length;
        this.value = formatted;
        try { this.setSelectionRange(pos + diff, pos + diff); } catch(e) {}
      }
      calcInvest();
    });
  });
  document.getElementById('investLoanRate').addEventListener('input', calcInvest);

  // 인쇄 항목 토글
  document.querySelectorAll('.ps-checks input[type="checkbox"]').forEach(function(chk) {
    var target = document.getElementById(chk.getAttribute('data-target'));
    if (!chk.checked) target.classList.add('print-hide');
    chk.addEventListener('change', function() {
      if (this.checked) { target.classList.remove('print-hide'); }
      else { target.classList.add('print-hide'); }
    });
  });

  // 대출 기간 커스텀
  document.getElementById('loanTerm').addEventListener('change', function() {
    var customWrap = document.getElementById('loanTermCustomWrap');
    if (this.value === 'custom') {
      customWrap.style.display = 'flex';
      document.getElementById('loanTermCustom').focus();
    } else {
      customWrap.style.display = 'none';
    }
    calcLoan();
  });
  document.getElementById('loanTermCustom').addEventListener('input', calcLoan);

  // 분담금 평형 — 행 클릭 시 체크박스 토글
  document.getElementById('mainBody').addEventListener('click', function(e) {
    var row = e.target.closest('tr.burden-row');
    if (!row) return;
    var chk = row.querySelector('.burden-chk');
    if (!chk) return;
    if (e.target !== chk) chk.checked = !chk.checked;
    var idx = parseInt(chk.getAttribute('data-row'));
    burdenChecked[idx] = chk.checked;
    if (chk.checked) {
      row.classList.remove('burden-unchecked');
    } else {
      row.classList.add('burden-unchecked');
    }
  });

  // 초기 렌더링
  render();
})();
