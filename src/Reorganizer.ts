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

  let igs = proj?.map((x: any) => {
    if (x.ItemGroup) {
      let values: string[] = [];
      x.ItemGroup.forEach((ig: any) => {
        if (ig.Folder || ig.Build) {
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
            "#text": "\n    "
          };
          ix++;
          x.ItemGroup[ix] = {
            "Build": [],
            ":@": {
              "@_Include": v
            }
          };
          ix++;

        });
        x.ItemGroup[ix] = {
          "#text": "\n    "
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
