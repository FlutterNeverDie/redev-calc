// ── UI 렌더링 & 이벤트 바인딩 ──────────────────

// 평형별 체크 상태 (기본 전부 해제)
var burdenChecked = {};

function resetBurdenChecked() {
  burdenChecked = {};
  for (var i = 0; i < priceData.length; i++) {
    burdenChecked[i] = false;
  }
}
resetBurdenChecked();

// ── 구역 전환 ─────────────────────────────────
function switchSite(siteKey) {
  loadSiteData(siteKey);
  var site = siteData[siteKey];

  // 타이틀 텍스트
  document.getElementById('siteTitle').textContent = site.title;
  document.querySelector('.title-sub').textContent = site.title;
  document.title = site.title;

  // 순위 헤더
  document.getElementById('rankHeader').textContent =
    '나의 감평가액 순위 추산 (총 ' + site.totalPeople.toLocaleString('ko-KR') + '명 기준)';

  // 분담금 테이블 비례율 헤더
  var ratioHeaders = document.querySelectorAll('.ratio-th');
  for (var i = 0; i < ratioHeaders.length; i++) {
    ratioHeaders[i].innerHTML = '<span class="ratio-label">비례율</span>' + site.ratioLabels[i];
  }

  // 대출 비례율 select
  var loanRatioSel = document.getElementById('loanRatio');
  var options = loanRatioSel.querySelectorAll('option:not([value="custom"])');
  for (var j = 0; j < options.length; j++) {
    options[j].value = site.ratios[j];
    options[j].textContent = site.ratioLabels[j];
  }

  // 대출 평형 select 갱신
  var loanTypeSel = document.getElementById('loanType');
  loanTypeSel.innerHTML = '<option value="">평형 선택</option>';
  for (var k = 0; k < priceData.length; k++) {
    var opt = document.createElement('option');
    opt.value = k;
    opt.textContent = priceData[k][0];
    loanTypeSel.appendChild(opt);
  }

  // 분양 세대 테이블 갱신
  renderSupplyTable();

  // 체크박스 초기화
  resetBurdenChecked();

  // 전환 버튼 텍스트 변경
  var fabZone = document.querySelector('.fab-zone');
  if (siteKey === 'sinheung') {
    fabZone.innerHTML = '수진<br>전환';
    fabZone.title = '수진동으로 전환';
  } else {
    fabZone.innerHTML = '신흥<br>전환';
    fabZone.title = '신흥으로 전환';
  }

  render();
}

// ── 분양 세대 테이블 렌더 ──────────────────────
function renderSupplyTable() {
  var site = siteData[currentSite];
  var sr = site.supplyRows;
  var tbody = document.getElementById('supplyBody');
  var rows = '';

  for (var i = 0; i < sr.length; i++) {
    rows += '<tr>'
      + '<td>' + sr[i].name + '</td>'
      + '<td>' + sr[i].units.toLocaleString('ko-KR') + '</td>'
      + '<td>' + sr[i].pct + '</td>'
      + '<td>' + sr[i].calc.toLocaleString('ko-KR') + '</td>'
      + '<td class="negative">' + sr[i].diff.toLocaleString('ko-KR') + '</td>'
      + '</tr>';
  }

  // 합계 행
  var totalUnits = 0, totalCalc = 0, totalDiff = 0;
  for (var j = 0; j < sr.length; j++) {
    totalUnits += sr[j].units;
    totalCalc += sr[j].calc;
    totalDiff += sr[j].diff;
  }
  rows += '<tr style="background:var(--surface2)">'
    + '<td style="font-weight:700">합계</td>'
    + '<td style="font-weight:700">' + totalUnits.toLocaleString('ko-KR') + '</td>'
    + '<td>100%</td>'
    + '<td>' + totalCalc.toLocaleString('ko-KR') + '</td>'
    + '<td class="negative" style="font-weight:700">' + totalDiff.toLocaleString('ko-KR') + '</td>'
    + '</tr>';

  tbody.innerHTML = rows;

  // 헤더 텍스트 갱신
  document.getElementById('supplyUnit').textContent =
    '총 ' + site.supplyTotal.toLocaleString('ko-KR') + '세대 중 분양 '
    + site.supplySale.toLocaleString('ko-KR') + '세대('
    + Math.round(site.supplySale / site.supplyTotal * 100) + '%), 임대 '
    + site.supplyRent.toLocaleString('ko-KR') + '세대('
    + Math.round(site.supplyRent / site.supplyTotal * 100) + '%)';

  // (b) × N = (c) 헤더 갱신
  document.getElementById('supplyCalcHeader').innerHTML =
    '(b) &times; ' + site.totalPeople.toLocaleString('ko-KR') + ' = (c)';
}

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
  if (percentileData.length === 0) {
    document.getElementById('rankPct').textContent = '데이터 준비 중';
    document.getElementById('rankPct').className = 'rank-value empty';
    document.getElementById('rankNum').textContent = '-';
    document.getElementById('rankNum').className = 'rank-value empty';
    document.getElementById('rankRange').textContent = '-';
    document.getElementById('rankRange').className = 'rank-value empty';
  } else if (rankInfo && myV) {
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

  // 구역 전환 버튼
  document.querySelector('.fab-zone').addEventListener('click', function(e) {
    e.preventDefault();
    switchSite(currentSite === 'sinheung' ? 'sujin' : 'sinheung');
  });

  // 분양 세대 테이블 초기 렌더
  renderSupplyTable();

  // 초기 렌더링
  render();
})();
