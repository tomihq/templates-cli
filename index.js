#!/usr/bin/env node
import * as p from "@clack/prompts";
import color from "picocolors";
import shell from "shelljs";
import fs from 'fs'
const availableRepositories = [
  {
    id: 1,
    user: "tomihq",
    name: "Nest.js with Postgres",
    repositoryName: "nestjs-postgres-starter",
  },
  {
    id: 2,
    user: "tomihq",
    name: "Express.js & Joi Validations & TypeScript",
    repositoryName: "express-joi-typescript",
  },
];

const exitOption = {
    id: availableRepositories.length + 1,
    name: "Exit CLI",
    end: true
}

availableRepositories.push(exitOption)

const options = availableRepositories.map((repository) => {
  return {
    value: repository.id,
    label: repository.repositoryName?`${repository.name} from @${repository.user}`:repository.name,
  };
});

async function throwError(error){
    p.intro(
        `${color.bgRed(
          color.white(error)
        )}`
      );
}

async function startProcess(){
    p.intro(
        `${color.bgMagenta(
          color.black("What template you would like to use?")
        )}`
      );
}

async function endProcess(){
    p.outro(`Thanks for using the CLI! Check the repository here and feel free to open issues or PR https://github.com/tomihq/templates-cli`);
    process.exit()
}

async function renderMenu() {
  const repository = await p.select({
    message: "Select one",
    options,
  });
 
  return p.isCancel(repository) || availableRepositories[repository - 1].end?endProcess():availableRepositories[repository - 1];
}



async function main() {
  let end = false;
  let user, repositoryName = "";
  while (!end) {
    startProcess()
    const {name: nameSelected, user: userSelected, repositoryName: repositoryNameSelected} = await renderMenu();
    user = userSelected
    if(fs.existsSync(repositoryNameSelected)){
        throwError("You've already cloned this repository in your current directory.")
        continue;
    }

    repositoryName = repositoryNameSelected
    const shouldContinue = await p.confirm({
      message: `This action will clone in your current directory the "${nameSelected}" repository. Are you sure?`,
    });

    if(!shouldContinue) continue;
    if(p.isCancel(shouldContinue)) endProcess()
    
    const s = p.spinner();
     shell.exec(
      `git clone https://github.com/${user}/${repositoryName}`
    ).stdout;
    p.intro("Done!");

  }

  endProcess()
  end = true;
}

main();
