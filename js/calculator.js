// ── 계산 유틸 & 순위 로직 ────────────────────

function fmt(n) {
  if (n === null || isNaN(n)) return '-';
  return (n < 0 ? '-' : '') + Math.abs(Math.round(n)).toLocaleString('ko-KR');
}

function getInputVal() {
  var raw = document.getElementById('myVal').value.replace(/,/g, '');
  var n = parseFloat(raw);
  return isNaN(n) ? 0 : n;
}

function getCustomRatio() {
  var raw = document.getElementById('customRatio').value.replace(/,/g, '');
  var n = parseFloat(raw);
  return isNaN(n) ? null : n / 100;
}

function calcAssigned(totalUnits, minFloor) {
  var eligibleFloors = TOTAL_FLOORS - minFloor + 1;
  return Math.round(totalUnits * eligibleFloors / TOTAL_FLOORS);
}

function calcRank(myVal) {
  if (!myVal) return null;
  for (var i = 0; i < percentileData.length; i++) {
    if (myVal >= percentileData[i].val) {
      if (i === 0) {
        return { pct: '1% 이내', rank: '22등 이내', range: '상위 1%' };
      }
      var upper = percentileData[i-1];
      var lower = percentileData[i];
      var ratio = (myVal - lower.val) / (upper.val - lower.val);
      var estRank = Math.round(lower.rank - ratio * (lower.rank - upper.rank));
      var estPct = (lower.pct - ratio * (lower.pct - upper.pct)).toFixed(1);
      return {
        pct: '상위 ' + estPct + '%',
        rank: '약 ' + estRank.toLocaleString('ko-KR') + '등',
        range: upper.pct + '% ~ ' + lower.pct + '%'
      };
    }
  }
  return { pct: '하위 10%', rank: '약 2,011등 이하', range: '하위권' };
}
