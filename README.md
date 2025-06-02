# 世田谷区ポスターマップ（鳥海彩後援会版）

> 本プロジェクトは [poster-map](https://github.com/takahiroanno2024/poster-map) をベースに、  
> **鳥海彩後援会** によって **世田谷区選挙向け**に機能・データを調整した fork 版です。  
> オリジナルの README 内容の一部を引用していますが、**対象地域や運用目的が異なる**点にご注意ください。

---

## アプリケーション概要

- 世田谷区内の選挙ポスター掲示板の位置を登録・管理し、**ポスター貼付け状況の可視化と進捗管理**を支援するシステムです。
- **鳥海彩後援会** により、2025 年の選挙活動のために調整されました。
- データは Google スプレッドシートで管理され、定期的に集計・公開されます。

---

## 動作サンプル

👉 [デモサイトはこちら](https://boisterous-cheesecake-103594.netlify.app/)

---

## サイトマップ

- `/`: トップページ（メニュー）
- `/map`: 世田谷区ポスターマップ
- `/summary`: 地区別進捗率ヒートマップ
- `/vote`: 期日前投票所マップ

---

## 本 fork での主な変更点

- 対象地域を「東京都全域」→「**世田谷区**」に限定
- データセット（掲示板位置情報等）を独自作成
- トップページの UI 調整
- オリジナル機能の簡素化・不要機能の削除

---

## 環境構成

- **Google Spreadsheet**  
  掲示板のデータベースとして使用、CSV として Web 公開
- **Python（csv2json, summarize 等）**
- **Netlify** によるサイト公開
- **cron** または GitHub Actions による自動更新

---

## データ構成（例）

- `data/all.csv`: 掲示板の位置・ステータス情報（元はスプレッドシート）
- `data/all.json`: 地図表示用に変換されたデータ
- `data/summary.json`: 地区別の貼付完了率
- `data/vote_venue.json`: 期日前投票所位置情報

---

## スクリプト

```bash
python csv2json_small.py data/all.csv public/data/
python summarize_progress.py public/data/
bash main.sh  # cron等で定期実行

## ライセンスについて

本リポジトリに含まれるソースコードおよび関連ファイルは、
[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)（GPL-3.0）に基づいて公開されています。

本プロジェクトは、[poster-map](https://github.com/takahiroanno2024/poster-map) をベースに、
鳥海彩後援会が地域・用途に合わせて改変したものであり、改変後のコードも同じGPL-3.0ライセンスのもとで再配布されます。

GPL-3.0の条項に基づき、改変内容の明示、ソースコードの公開、再配布の自由が保障されるとともに、
他の利用者にも同等の自由が継承されることを目的としています。

## 謝辞

本プロジェクトの構築にあたり、以下の技術・ライブラリ・公開データを利用させていただきました。
優れたソフトウェアやデータを公開・提供してくださっている開発者・関係者の皆様に、心より感謝申し上げます。

- [Leaflet](https://leafletjs.com/)
  └ 地図描画およびインタラクションに使用

- [Linked Open Addresses Japan (LOAJ)](https://uedayou.net/loa/)
  └ `/summary` ページにて、各市区町村のポリゴンデータを可視化に使用

- [OpenStreetMap](https://www.openstreetmap.org/),
  [国土地理院 地図](https://maps.gsi.go.jp/),
  [Google Maps](https://www.google.com/maps)
  └ ベースマップとして利用

```
