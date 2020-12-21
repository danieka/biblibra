schema.__schema.types.find((t) => t.name === name);
import schema from "../../schema.json";

interface Model {
  fields: {
    name: string;
    type: {
      kind: string;
      name: null;
      ofType: {
        kind: string;
        name: string;
        ofType: null;
      };
    };
  }[];
}

export function assert(condition: boolean) {
  if (!condition) {
    throw new Error("Assertion error");
  }
}

export function findModel(name: string): Model {
  const model = schema.__schema.types.find((t) => t.name === name);
  assert(model !== undefined);
  assert(model !== null);
  return model as Model;
}
