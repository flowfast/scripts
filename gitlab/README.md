## Gitlab scripts

|script|description|
|--|--|
|create-issue.js| Creates issue based on Kaiten's card data|

Each script is executable

## How to prepare environment

1. git clone https://github.com/kaiten-hq/scripts.git
2. cd scripts/gitlab
3. npm install
4. cp params.json.tpl params.json (apply your params)
5. ./create-issue.js -c XXXX, where XXXX - id of card in kaiten
