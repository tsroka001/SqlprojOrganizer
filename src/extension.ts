"use strict";
import * as vscode from "vscode";
import process from "./Reorganizer";

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sqlproj-reorganizer.file-menu",
      (uri: vscode.Uri) => {
        try {
          let res: string = process(uri.fsPath);
          vscode.window.showInformationMessage(res);
        } catch (error: any) {
          vscode.window.showInformationMessage(error.message);
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sqlproj-reorganizer.ssdt-menu",
      (uri: any) => {
        try {
          let res: string = process(uri?.element?.fileSystemUri?._fsPath);
          vscode.window.showInformationMessage(res);
        } catch (error: any) {
          vscode.window.showInformationMessage(error.message);
        }
      }
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
