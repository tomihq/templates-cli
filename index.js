#!/usr/bin/env node
import * as p from '@clack/prompts'
import color from 'picocolors';

const availableRepositories = [
   
]

async function main(){
    p.intro(`${color.bgMagenta(color.black('Welcome. What template you would like to use?'))}`)
}

main()