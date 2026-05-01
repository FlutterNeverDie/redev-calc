// ── 구역별 데이터 ──────────────────────────────

var siteData = {
  sinheung: {
    name: '신흥1구역',
    title: '신흥1구역 재개발 추천매물',
    priceData: [
      ['39m\u00B2',  426450910,  636],
      ['59m\u00B2',  793701051,  750],
      ['74m\u00B2',  918289720,  145],
      ['84m\u00B2',  993967412, 1236],
      ['104m\u00B2', 1189290753, 523]
    ],
    ratios: [1.00701, 1.10, 1.20, 1.30],
    ratioLabels: ['100.7%', '110%', '120%', '130%'],
    totalPeople: 2250,
    percentileData: [
      {pct: 1,  rank: 22,   val: 1872772150},
      {pct: 5,  rank: 112,  val: 968044560},
      {pct: 10, rank: 223,  val: 701362180},
      {pct: 20, rank: 447,  val: 604431100},
      {pct: 30, rank: 670,  val: 562565910},
      {pct: 40, rank: 894,  val: 537316660},
      {pct: 45, rank: 1005, val: 525576740},
      {pct: 50, rank: 1117, val: 516469440},
      {pct: 55, rank: 1229, val: 508552000},
      {pct: 60, rank: 1340, val: 501313710},
      {pct: 70, rank: 1564, val: 484461635},
      {pct: 80, rank: 1787, val: 463581840},
      {pct: 90, rank: 2011, val: 384500000}
    ],
    supplyTotal: 3754,
    supplySale: 3290,
    supplyRent: 464,
    supplyRows: [
      { name: '39m\u00B2', units: 636, pct: '19.33%', calc: 435, diff: -201 },
      { name: '59m\u00B2', units: 750, pct: '22.80%', calc: 513, diff: -237 },
      { name: '74m\u00B2', units: 145, pct: '4.41%', calc: 99, diff: -46 },
      { name: '84m\u00B2', units: 1236, pct: '37.57%', calc: 845, diff: -391 },
      { name: '104m\u00B2', units: 523, pct: '15.90%', calc: 358, diff: -165 }
    ]
  },
  sujin: {
    name: '수진1구역',
    title: '수진1구역 재개발 추천매물',
    priceData: [
      ['39m\u00B2',  399260000,  444],
      ['41m\u00B2',  419810000,   23],
      ['51m\u00B2',  590420000,  158],
      ['59m\u00B2',  786050000,  784],
      ['74m\u00B2',  894730000,  175],
      ['84m\u00B2',  962070000, 1870],
      ['104m\u00B2', 1119630000, 508]
    ],
    ratios: [1.005, 1.10, 1.20, 1.30],
    ratioLabels: ['100.5%', '110%', '120%', '130%'],
    totalPeople: 2733,
    percentileData: [],
    supplyTotal: 4844,
    supplySale: 3962,
    supplyRent: 882,
    supplyRows: [
      { name: '39m\u00B2', units: 444, pct: '11.21%', calc: 306, diff: -138 },
      { name: '41m\u00B2', units: 23, pct: '0.58%', calc: 16, diff: -7 },
      { name: '51m\u00B2', units: 158, pct: '3.99%', calc: 109, diff: -49 },
      { name: '59m\u00B2', units: 784, pct: '19.79%', calc: 541, diff: -243 },
      { name: '74m\u00B2', units: 175, pct: '4.42%', calc: 121, diff: -54 },
      { name: '84m\u00B2', units: 1870, pct: '47.22%', calc: 1290, diff: -580 },
      { name: '104m\u00B2', units: 508, pct: '12.82%', calc: 350, diff: -158 }
    ]
  }
};

// ── 활성 데이터 (기본: 신흥) ──────────────────
var currentSite = 'sinheung';
var priceData, ratios, TOTAL_PEOPLE, percentileData;

function loadSiteData(siteKey) {
  var site = siteData[siteKey];
  currentSite = siteKey;
  priceData = site.priceData;
  ratios = site.ratios;
  TOTAL_PEOPLE = site.totalPeople;
  percentileData = site.percentileData;
}

loadSiteData('sinheung');
