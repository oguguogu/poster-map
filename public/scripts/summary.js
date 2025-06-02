/**
 * Modified by 鳥海彩後援会 (2025)
 * Based on original work from poster-map by takahiroanno2024 (GPL-3.0)
 * This file is part of a project licensed under the GNU General Public License v3.0.
 * See LICENSE file or https://www.gnu.org/licenses/gpl-3.0.html for details.
 */

const INITIAL_CENTER = [35.6368549, 139.633389];
const INITIAL_ZOOM = 12;

const map = L.map("map").setView(INITIAL_CENTER, INITIAL_ZOOM);

// 背景地図はOpenStreetMap
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Linked Open Addresses Japan',
}).addTo(map);

function legend() {
  var control = L.control({ position: "topright" });
  control.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    grades = [1, 0.75, 0.5, 0.25, 0];

    div.innerHTML += "<p>凡例</p>";

    var legendInnerContainerDiv = L.DomUtil.create(
      "div",
      "legend-inner-container",
      div
    );
    legendInnerContainerDiv.innerHTML += '<div class="legend-gradient"></div>';

    var labelsDiv = L.DomUtil.create(
      "div",
      "legend-labels",
      legendInnerContainerDiv
    );
    for (var i = 0; i < grades.length; i++) {
      labelsDiv.innerHTML += "<span>" + grades[i] * 100 + "%</span>";
    }
    return div;
  };

  return control;
}

function getProgressColor(percentage) {
  // Define the color stops
  const colorStops = [
    { pct: 0.0, color: { r: 226, g: 207, b: 226 } }, // #E2CFE2
    { pct: 0.25, color: { r: 197, g: 160, b: 197 } }, // #C5A0C5
    { pct: 0.5, color: { r: 182, g: 136, b: 183 } }, // #B688B7
    { pct: 0.75, color: { r: 153, g: 89, b: 154 } }, // #99599A
    { pct: 0.99, color: { r: 139, g: 65, b: 139 } }, // #8B418B
    { pct: 1.0, color: { r: 110, g: 18, b: 111 } }, // #6E126F
  ];

  // Ensure percentage is within bounds
  percentage = Math.max(0, Math.min(1, percentage));

  // Find the two closest color stops
  let lower = colorStops[0];
  let upper = colorStops[colorStops.length - 1];

  for (let i = 1; i < colorStops.length; i++) {
    if (percentage <= colorStops[i].pct) {
      upper = colorStops[i];
      lower = colorStops[i - 1];
      break;
    }
  }

  // Calculate the interpolated color
  const rangePct = (percentage - lower.pct) / (upper.pct - lower.pct);
  const r = Math.round(
    lower.color.r + rangePct * (upper.color.r - lower.color.r)
  );
  const g = Math.round(
    lower.color.g + rangePct * (upper.color.g - lower.color.g)
  );
  const b = Math.round(
    lower.color.b + rangePct * (upper.color.b - lower.color.b)
  );

  // Return the color as a string
  return `rgb(${r}, ${g}, ${b})`;
}

function getGeoJsonStyle(progress) {
  return {
    color: "black",
    fillColor: getProgressColor(progress),
    fillOpacity: 0.7,
    weight: 2,
  };
}

let areaList;
let progress;

Promise.all([getAreaList(), getProgress(), getProgressCountdown()])
  .then(function (res) {
    areaList = res[0];
    progress = res[1];
    progressCountdown = res[2];

    // 🌍 setagaya_town.geojson を一括読み込み
    fetch("/data/setagaya_town.geojson")
      .then((response) => response.json())
      .then((fullGeoJson) => {
        for (let [key, areaInfo] of Object.entries(areaList)) {
          const areaName = areaInfo["area_name"];

          // 📌 町名に一致するFeatureを検索
          const feature = fullGeoJson.features.find(
            (f) => f.properties["町名"] === areaName
          );

          if (!feature) {
            console.warn(`GeoJSONに町名 ${areaName} が見つかりません`);
            continue;
          }

          const polygon = L.geoJSON(feature, {
            style: getGeoJsonStyle(progress[key]), //key
          });

          polygon.bindPopup(`
            <b>${areaName}</b><br>
            ポスター貼り進捗: ${(progress[key] * 100).toFixed(1)}%<br> 
            残り: ${progressCountdown[key]}ヶ所
          `); // key

          polygon.addTo(map);
        }

        // 全体表示・凡例など
        progressBox((progress["total"] * 100).toFixed(2), "topright").addTo(
          map
        );
        progressBoxCountdown(
          parseInt(progressCountdown["total"]),
          "topright"
        ).addTo(map);
        legend().addTo(map);
        map.setView(INITIAL_CENTER, INITIAL_ZOOM);
      })
      .catch((error) => {
        console.error("GeoJSON読み込みエラー:", error);
      });
  })
  .catch((error) => {
    console.error("初期データ取得エラー:", error);
  });

// Promise.all([getAreaList(), getProgress(), getProgressCountdown()]).then(function(res) {
//   areaList = res[0];
//   progress = res[1];
//   progressCountdown = res[2];

//   // for (let [key, areaInfo] of Object.entries(areaList)) {
//   //   console.log(areaInfo['area_name']);
//   //   fetch(`https://uedayou.net/loa/東京都世田谷区${areaInfo['area_name']}.geojson`)
//   //     .then((response) => {
//   //       if (!response.ok) {
//   //         throw new Error(`Failed to fetch geojson for ${areaInfo['area_name']}`);
//   //       }
//   //       return response.json();
//   //     })
//   //     .then((data) => {
//   //       const polygon = L.geoJSON(data, {
//   //         style: getGeoJsonStyle(progress[key]),
//   //       });
//   //       polygon.bindPopup(`<b>${areaInfo['area_name']}</b><br>ポスター貼り進捗: ${(progress[key]*100).toFixed(1)}%<br>残り: ${progressCountdown[key]}ヶ所`);
//   //       polygon.addTo(map);
//   //     })
//   //     .catch((error) => {
//   //       console.error('Error fetching geojson:', error);
//   //     });
//   // }
//   progressBox((progress['total']*100).toFixed(2), 'topright').addTo(map);
//   progressBoxCountdown((parseInt(progressCountdown['total'])), 'topright').addTo(map);
//   legend().addTo(map);
//   // ⭐ ここで地図の中心位置を再設定
//   map.setView(INITIAL_CENTER, INITIAL_ZOOM);
// }).catch((error) => {
//   console.error('Error in fetching data:', error);
// });
