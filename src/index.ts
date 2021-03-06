#!/usr/bin/env node

const child_process = require('child_process');
const path = require('path');
const texts = require('./texts.js');
const utils = require('./utils.js');

// START HERE:
main();

function main() {
    const gitRepoUrl = process.argv[2];
    if (gitRepoUrl === "--help") {
        console.log(texts.USAGE);
        return;
    }

    if (
        !validateGitRepoUrl(gitRepoUrl)
        || !gitClone(gitRepoUrl)
        || !openVscode(gitRepoUrl)
    ) {
        return;
    }
    utils.consoleLogGreen(texts.SUCCESS(gitRepoUrl));
}

function validateGitRepoUrl(gitRepoUrl: string): boolean {
    if (!gitRepoUrl) {
        utils.consoleErrorRed(texts.NO_GIT_REPO);
        return false;
    } else if (!utils.verifyValidGitRepoUrl(gitRepoUrl)) {
        utils.consoleErrorRed(texts.GIT_REPO_NOT_VALID(gitRepoUrl));
        return false;
    }
    return true;
}

function gitClone(gitRepoUrl: string): boolean {
    try {
        child_process.execSync(`git clone ${gitRepoUrl}`, { stdio: 'inherit' });
        return true;
    } catch (e) {
        return false;
    }
}

function openVscode(gitRepoUrl: string): boolean {
    const folderName = path.parse(gitRepoUrl).name;
    try {
        child_process.execSync(`code ./${folderName}`, { stdio: 'inherit' });
        return true;
    } catch (e) {
        return false;
    }
}
