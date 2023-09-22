'use strict';
/*
vscode-live-code-runner
(C) Copyright 2016-2017 Lablup Inc.
Licensed under MIT
*/
/*jshint esnext: true */
const vscode = require("vscode");
class LiveCodeRunnerView {
    constructor() {
        this.console_log = vscode.window.createOutputChannel("Backend.AI");
        this.provider = new SornaCodeRunnerInteractiveView();
        this.registration = vscode.workspace.registerTextDocumentContentProvider('code-runner-view', this.provider);
        this.previewUri = vscode.Uri.parse('code-runner-view://authority/code-runner-view');
    }
    // Clear content
    clearConsole() {
        return this.console_log.clear();
    }
    // Set error message
    setErrorMessage(content) {
        return this.console_log.appendLine('[ERROR] ' + content);
    }
    // Adds console message
    addConsoleMessage(content) {
        return this.console_log.appendLine(content);
    }
    showConsole() {
        return this.console_log.show();
    }
    addOutput(consoleItems) {
        let html = '';
        for (let c of Array.from(consoleItems)) {
            switch (c[0]) {
                case 'stdout':
                    html += `<span class="live-console stdout">${this.escapeHtml(c[1])}</span>`;
                    break;
                case 'stderr':
                    html += `<span class="live-console stderr">${this.escapeHtml(c[1])}</span>`;
                    break;
                case 'media':
                    switch (c[1][0]) {
                        case 'image/svg+xml':
                            html += c[1][1];
                            break;
                        default:
                    }
                    break;
                default:
            }
        }
        this.addHtmlContent(html);
        return html != '';
    }
    addHtmlContent(content) {
        this.provider.appendContent(content);
        return this.provider.update(this.previewUri);
    }
    clearHtmlContent() {
        this.provider.clearContent();
        return this.provider.update(this.previewUri);
    }
    showResultPanel() {
        return vscode.commands.executeCommand('vscode.previewHtml', this.previewUri, vscode.ViewColumn.Two, 'RESULT');
    }
    escapeHtml(text) {
        return text.replace(/[\"&<>]/g, function (a) {
            return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
        });
    }
}
exports.LiveCodeRunnerView = LiveCodeRunnerView;
class SornaCodeRunnerInteractiveView {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
    }
    provideTextDocumentContent(uri) {
        return this.createView();
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
    setContent(content) {
        this._content = content;
        return true;
    }
    appendContent(content) {
        if (this._content === undefined) {
            this._content = '';
        }
        this._content = this._content + content;
        return true;
    }
    clearContent() {
        this._content = `<style>
            .live-console {
                font-family: monospace;
                white-space: pre;
            }
            .stderr {
                color: #ff2222;
            }
        </style>`;
        return true;
    }
    createView() {
        if (this._content === undefined) {
            this._content = '';
        }
        return `<style>
            .live-console {
                font-family: monospace;
                white-space: pre;
            }
            .stderr {
                color: #ff2222;
            }
        </style>` + this._content;
    }
}
exports.SornaCodeRunnerInteractiveView = SornaCodeRunnerInteractiveView;
//# sourceMappingURL=live-code-runner-view.js.map