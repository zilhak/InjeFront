class IdGenerator {
  private static instance: IdGenerator;
  private id = 0;

  private constructor() {}

  private static getInstance(): IdGenerator {
    if (!IdGenerator.instance) {
      IdGenerator.instance = new IdGenerator();
    }
    return IdGenerator.instance;
  }

  public static generateId(): number {
    if (this.getInstance().id > 100000)
      this.getInstance().id = 0;
    
    return this.getInstance().id++;
  }
}

export default IdGenerator;
