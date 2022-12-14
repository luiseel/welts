// eslint-disable-next-line no-unused-vars
type Action = (args: string[]) => string;

interface BaseCommand {
  name: string;
  args?: string[];
  action: Action;
  prompt?: Action;
  help?: string;
}

interface Command extends BaseCommand {
  enabled: boolean;
}

export class CommandManager {
  private commands: Command[];
  private errorMsg: string;
  private prompt?: { cmd: Command; args: string[] };

  constructor(errorMsg: string) {
    this.commands = [];
    this.errorMsg = errorMsg;
  }

  registerCmd({ name, args, action, prompt, help }: BaseCommand) {
    const exists = this.commands.find((it) => it.name === name);
    if (exists) throw new Error("Prompt already exists");
    this.commands.push({ name, args, action, prompt, help, enabled: true });
  }

  registerCmds(cmds: BaseCommand[]) {
    return cmds.forEach((it) => this.registerCmd(it));
  }

  execCmd(prompt: string, errorMsg?: string) {
    if (this.prompt) {
      const cmdPrompt = this.prompt;
      this.prompt = undefined;
      const args = cmdPrompt.args;
      const input = prompt.toLowerCase().trim();
      return cmdPrompt.cmd.action([...args, input]);
    }
    const parts = prompt.toLowerCase().trim().split(/ +/);
    const [cmdName] = parts;
    const cmd = this.commands.find((it) => it.enabled && it.name === cmdName);
    if (!cmd) return errorMsg ?? this.errorMsg;
    const args = parts.splice(1);
    if (cmd.prompt) {
      this.prompt = { cmd, args };
      return cmd.prompt(args);
    }
    return cmd.action(args);
  }

  enableCmd(name: string) {
    const cmd = this.findCmd(name);
    cmd.enabled = true;
  }

  enableCmds(name: string[]) {
    return name.forEach((it) => this.enableCmd(it));
  }

  disableCmd(name: string) {
    const cmd = this.findCmd(name);
    cmd.enabled = false;
  }

  disableCmds(name: string[]) {
    return name.forEach((it) => this.disableCmd(it));
  }

  listCmds(enabled = true) {
    return this.commands.filter((it) => it.enabled === enabled);
  }

  private findCmd(name: string) {
    const cmd = this.commands.find((it) => it.name === name);
    if (!cmd) throw new Error(`Command "${name}" was not found`);
    return cmd;
  }
}
