import IdGenerator from "../../src/utils/IdGenerator.ts";

describe("IdGenerator", () => {
  let id_generated = new Set<number>();

  beforeAll(() => {
    id_generated.add(IdGenerator.generateId());
  });
  
  it("should generate incremented unique ids in global scope", () => {
    const id = IdGenerator.generateId();
    
    expect(id_generated.has(id)).toBe(false);

    id_generated.add(id);
  });

  it("should generate incremented unique ids in global scope", () => {
    const id = IdGenerator.generateId();
    
    expect(id_generated.has(id)).toBe(false);

    id_generated.add(id);
  });
});