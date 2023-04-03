import {
  XMLParser,
  XMLBuilder,
  XmlBuilderOptions,
  X2jOptions,
} from "fast-xml-parser";
import fs = require("fs");

const process = (path: string) => {
  const xmlData = fs.readFileSync(path, "utf8");

  const parserOptions: Partial<X2jOptions> = {
    ignoreAttributes: false,
    parseTagValue: false,
    preserveOrder: true,
    processEntities: false,
    commentPropName: "#comment",
    trimValues: false,
  };
  const parser = new XMLParser(parserOptions);

  let jObj = parser.parse(xmlData);

  let proj = jObj.find((x: any) => x.Project)?.Project;

  proj?.map((x: any) => {
    if (x.ItemGroup) {
      let itemType: string = "";
      let values: string[] = [];
      x.ItemGroup.forEach((ig: any) => {
        if (ig.Folder || ig.Build) {
          ig.Folder ? (itemType = "Folder") : (itemType = "Build");
          if (ig[":@"]) {
            values.push(ig[":@"]["@_Include"]);
          }
        }
      });

      if (values.length > 0) {
        values.sort();
        let ix = 0;
        values.forEach((v: any) => {
          x.ItemGroup[ix] = {
            "#text": "\n    ",
          };
          ix++;
          if (itemType === "Folder") {
            x.ItemGroup[ix] = {
              Folder: [],
              ":@": {
                "@_Include": v,
              },
            };
          } else {
            x.ItemGroup[ix] = {
              Build: [],
              ":@": {
                "@_Include": v,
              },
            };
          }

          ix++;
        });
        x.ItemGroup[ix] = {
          "#text": "\n    ",
        };

        console.dir(x.ItemGroup);
      }
    } else {
      return x;
    }
  });

  let builderOptions: Partial<XmlBuilderOptions> = {
    ignoreAttributes: false,
    preserveOrder: true,
    commentPropName: "#comment",
    processEntities: false,
    suppressEmptyNode: true,
  };

  const builder = new XMLBuilder(builderOptions);
  const xmlContent = builder.build(jObj);

  console.log("xmlContent");
};

export default process;
