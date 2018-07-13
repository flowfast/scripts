#!/usr/bin/env node

const Gitlab = require('gitlab/dist/es5').default;
const colors = require('colors');
const axios = require("axios");
const fs = require("fs");
const { version } = require("./package.json");
const program = require("commander");

const error = (text) => colors.red(text);

if (!fs.existsSync("./params.json")) {
  error("params.json is missing (look for params.json.tpl as template)");
  process.exit(1);
}

const params = require("./params.json");

program
  .version(version)
  .usage('[options]')
  .option("-c, --card <n>", "Kaiten's card id", parseInt)
  .parse(process.argv);

if (!program.card) {
  program.outputHelp(error);
  return;
}

const id = program.card;

const service = new Gitlab({
  url: params.gitlabUrl,
  token: params.gitlabToken
});

const kaitenApi = axios.create({
  baseURL: `${params.kaitenUrl}/api/latest/`,
  timeout: 10000,
  auth: {
    username: params.kaitenUsername,
    password: params.kaitenPassword
  }
});

const createIssue = async (id) => {
  const { data } = await kaitenApi.get(`cards/${id}`);

  const issue = await service.Issues.create(params.gitlabProjectId, {
    title: data.title,
    description: data.description
  })

  return issue;
}

createIssue(id)
  .then((issue) => {
    console.log('Gitlab issue:', issue.web_url);
    process.exit(0);
  })
  .catch(e => {
    console.log(error(e.message));
    console.error(e);
    process.exit(1);
  })
