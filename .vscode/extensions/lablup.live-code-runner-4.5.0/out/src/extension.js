'use strict';
/*
vscode-live-code-runner
(C) Copyright 2016-2018 Lablup Inc.
Licensed under MIT
*/
/*jshint esnext: true */
const vscode = require("vscode");
const live_code_runner_1 = require("./live-code-runner");
function activate(context) {
    let CodeRunner = new live_code_runner_1.LiveCodeRunner();
    let disposable = vscode.commands.registerCommand('live-code-runner.runCode', () => {
        return CodeRunner.runcode();
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map