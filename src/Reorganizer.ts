import fs = require("fs");
import { ParserOptions, parseString, Builder } from "xml2js";

const process = (path: string) : string  => {
  let xmlData = fs.readFileSync(path, "utf8");
  let opts: ParserOptions = {};

  let outString: string = "";

  parseString(xmlData, opts, function (err: Error | null, parsedJSON: any){
    if(err){
      outString = err.message;
      return;
    }

    let proj = parsedJSON.Project;
    let itemGroups = proj.ItemGroup;

    let combinedPackageReferences = [];
    let combinedFolders = [];
    let combinedBuilds = [];
    let combinedNone = [];

    //Sort items to minimize the number of groups
    for (let itemGroup of itemGroups) {
      if (itemGroup.PackageReference) {
        combinedPackageReferences.push(...itemGroup.PackageReference);
      }
      if (itemGroup.Folder) {
        combinedFolders.push(...itemGroup.Folder);
      }
      if (itemGroup.Build) {
        combinedBuilds.push(...itemGroup.Build);
      }
      if (itemGroup.None) {
        combinedNone.push(...itemGroup.None);
      }
    }

    //Clear the item groups and add the sorted items back in
    itemGroups.length = 0;
    itemGroups.push(
      { PackageReference: combinedPackageReferences },
      {
        Folder: combinedFolders.sort((a: any, b: any) => {
          return a["$"]["Include"] > b["$"]["Include"] ? 1 : -1;
        }),
      },
      {
        Build: combinedBuilds.sort((a: any, b: any) => {
          return a["$"]["Include"] > b["$"]["Include"] ? 1 : -1;
        }),
      },
      {
        None: combinedNone.sort((a: any, b: any) => {
          return a["$"]["Include"] > b["$"]["Include"] ? 1 : -1;
        }),
      }
    );

    const builder = new Builder();
    let xmlOutput = builder.buildObject(parsedJSON);

    if(xmlOutput === xmlData) {
      outString = ("No changes required to " + path);
    } else {
      fs.writeFileSync(path, xmlOutput, "utf8");
      outString = ("Updated " + path);
    }
  });

  return outString;
};

export default process;