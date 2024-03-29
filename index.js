#!/usr/bin/env node
import * as p from "@clack/prompts";
import color from "picocolors";
import shell from "shelljs";
import fs from 'fs'
import { availableRepositories } from "./repositories.js";


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


async function main() {
  let end = false;
  let user, repositoryName = "";
  while (!end) {
    startProcess()
    const {name: nameSelected, user: userSelected, repositoryName: repositoryNameSelected} = await renderMenu();
    user = userSelected
    if(fs.existsSync(repositoryNameSelected)){
        throwError("You've already cloned this repository in your current directory ❗")
        continue;
    }

    repositoryName = repositoryNameSelected
    const shouldContinueWithInstallation = await p.confirm({
      message: `💡 This action will clone in your current directory the "${nameSelected}" repository. Are you sure?`,
    });

    if(!shouldContinueWithInstallation || p.isCancel(shouldContinueWithInstallation)) continue;
    
     shell.exec(
      `git clone https://github.com/${user}/${repositoryName}`
    ).stdout;
    p.intro("Done!");

  }

  endProcess()
}

async function startProcess(){
    p.intro(
        `${color.bgMagenta(
          color.white("📚 What template would you like to use?")
        )}`
      );
}

async function renderMenu() {
    const repository = await p.select({
      message: "Select one",
      options,
    });
   
    return p.isCancel(repository) || availableRepositories[repository - 1].end?endProcess():availableRepositories[repository - 1];
  }

async function throwError(error){
    p.intro(
        `${color.bgRed(
          color.white(error)
        )}`
      );
}

async function endProcess(){
    p.outro(`${color.bgGreen(color.black(`Thanks for using the CLI! Check the repository here and feel free to open issues or PR https://github.com/tomihq/templates-cli`))}`);
    process.exit()
}


main();
