export type ContextOptions = {
  command: string
  homeDir?: string
  rootDir?: string
  args?: Record<string, string>

}

export default class Context {
  [x: string]: any;

  constructor({ command, args = {}, rootDir = process.cwd(), homeDir }: ContextOptions) {
    this.command = command
    this.commandArgs = args
    this.rootDir = rootDir
    this.homeDir = homeDir

    this.init()
  }

  init() {}

  async start() {
    // 运行命令
    const command = require(`./commands/${this.command}`);
    await command(this);
  }
}
