#!/bin/env bash
set -euo pipefail

source ~/poster-map/venv/bin/activate  # 仮想環境を有効化

cd ~/poster-map/ #Path to the folder

git pull

# Download latest CSV from spreadsheet datbase
curl -sL "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm1Pc_nZQnhvI2dnpQf42Ru8BOrAbqt-VKWZJtp8_pX9KDEjUThFAERjyrxW7JmDxPVIjH0n3EnIOz/pub?output=csv" > public/data/all.csv

# all.json
python3 csv2json_small.py public/data/all.csv public/data/

# summary.json
python3 summarize_progress.py ./public/data/summary.json

# summary_absolute.json
python3 summarize_progress_absolute.py ./public/data/summary_absolute.json

git add -N .

if ! git diff --exit-code --quiet
then
    git add .
    git commit -m "Update"
    git push
    #source .env
    #npx netlify-cli deploy --prod --message "Deploy" --dir=./public --auth $NETLIFY_AUTH_TOKEN
fi
