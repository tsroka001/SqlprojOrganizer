import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';
import XmlReorganizer from "../../Reorganizer";
import { Builder, Parser } from "xml2js";
import { it, describe } from "mocha";
import fs = require("fs");
import path = require("path");

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  const fixturesFolderLocation = path.join(
    path.dirname(__filename),
    "/../../../src/test/suite/fixtures/"
  );

  test("Sample test", () => {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });

  describe("XmlReorganizer", () => {
    const parser = new Parser();
    const builder = new Builder();

    it("should sort items by Include attribute", () => {
      let outVal: string = "";

      const mockFS = {
        readFileSync: (path: string, encoding: string) => {
          return fs.readFileSync(
            fixturesFolderLocation +
              "test1input.sqlproj",
            "utf8"
          );
        },
        writeFileSync: (path: string, data: string, encoding: string) => {
          outVal = data;
          return;
        },
      };

      const xmlReorganizer = new XmlReorganizer(mockFS, parser, builder);

      const expectedOutput = fs.readFileSync(
        fixturesFolderLocation + "test1output.sqlproj",
        "utf8"
      );

      xmlReorganizer.process("path//to//file");

      const actualOutput = outVal;

      assert.strictEqual(actualOutput, expectedOutput);

    });
  });
});
