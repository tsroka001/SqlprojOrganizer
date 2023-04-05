"use strict";
import * as vscode from "vscode";
import XmlReorganizer from "./Reorganizer"; "./Reorganizer";
import fs = require("fs");
import { Builder, Parser } from "xml2js";

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "sqlproj-reorganizer.file-menu",
      (uri: vscode.Uri) => {
        try {
          const parser = new Parser();
          const builder = new Builder();
          const xmlReorganizer = new XmlReorganizer(fs, parser, builder);
          let res: string = xmlReorganizer.process(uri.fsPath);
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
          const parser = new Parser();
          const builder = new Builder();
          const xmlReorganizer = new XmlReorganizer(fs, parser, builder);
          let res: string = xmlReorganizer.process(uri?.element?.fileSystemUri?._fsPath);
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
