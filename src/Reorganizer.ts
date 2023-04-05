class XmlReorganizer {
  constructor(private fs: any, private parser: any, private builder: any) {}

  private sortFunction = (a: any, b: any) => {
    try{
      let aVal = a["$"]["Include"];
      let bVal = b["$"]["Include"];

      return aVal.toLowerCase().localeCompare(bVal.toLowerCase());
    } catch (e: any) {
      //If the above fails, Jesus take the wheel
      return JSON.stringify(a).localeCompare(JSON.stringify(b));
    }
  };

  private getGroupMap(itemGroups: any): Map<string, any> {
    let groupMap = new Map<string, any>();

    for (let itemGroup of itemGroups) {
      for (let key of Object.keys(itemGroup)) {
        if (groupMap.has(key)) {
          groupMap.get(key).push(...itemGroup[key]);
        } else {
          groupMap.set(key, itemGroup[key]);
        }
      }
    }

    return groupMap;
  };

  private sortGroupMapItems(groupMap: Map<string, any>): void {
    groupMap.forEach((value) => {
      value.sort(this.sortFunction);
    });
  }

  private rebuildItemGroups(groupMap: Map<string, any>, itemGroups: any): void {
    itemGroups.length = 0;

    for (let [key, value] of groupMap) {
      if(itemGroups.some((x: any) => x[key])) {
        itemGroups.find((x: any) => x[key])[key].push(...value);
      } else {
        itemGroups.push({[key]: [...value]});
      }
    }
  }

  public process(path: string): string {
    let xmlData = this.fs.readFileSync(path, "utf8");
    let outString: string = "";

    this.parser.parseString(xmlData,  (err: Error | null, parsedJSON: any) => {
      if (err) {
        outString = err.message;
        return;
      }

      const itemGroups = parsedJSON.Project.ItemGroup;

      const groupMap = this.getGroupMap(itemGroups);

      this.sortGroupMapItems(groupMap);

      this.rebuildItemGroups(groupMap, itemGroups);

      const xmlOutput = this.builder.buildObject(parsedJSON);

      if (xmlOutput === xmlData) {
        outString = "No changes required to " + path;
      } else {
        this.fs.writeFileSync(path, xmlOutput, "utf8");
        outString = "Updated " + path;
      }
    });

    return outString;
  }
}

export default XmlReorganizer;