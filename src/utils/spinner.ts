import SpinnerCli from 'cli-spinner';
import chalk from 'chalk';

const spinner = SpinnerCli.Spinner();
spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'); // https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json

export default {
  start: (title?:string) => {
    if (title) {
      spinner.setSpinnerTitle(`${chalk.yellow('%s')} ${title}`);
    }
    spinner.start();
  },
  stop: (clear:boolean = false) => {
    spinner.stop(clear);
  },
  setTitle: (title:string = '') => {
    spinner.setSpinnerTitle(title)
  },
  setString: (string:string = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏') => {
    spinner.setSpinnerString(string);
  }
};
