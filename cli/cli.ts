#!/usr/bin/env node
import { Command } from 'commander';
import { changeEnv } from './commands/changeEnv';
import { config } from './commands/config';
import { link } from './commands/link';
import { login } from './commands/login';
import { logOut } from './commands/logOut';
import { pull } from './commands/pull';
import { push } from './commands/push';
import { status } from './commands/status';
import { unlink } from './commands/unlink';

const program = new Command();

// Login command
program.command('login').description('Log in to Env Manager').action(login);

// Pull variables
program.command('pull').description('Fetch environment variables for a project').action(pull);

// Push variables
program
  .command('push')
  .description("Push environment variables from a file to a project's environment")
  .action(push);

// Logout command
program.command('logout').description('Log out of your current Env Manager account').action(logOut);

// Link project to current directory
program.command('link').description('Link a project to the current directory').action(link);
// Unlink project from current directory
program.command('unlink').description('Unlink a project from the current directory').action(unlink);

// Change environment
program
  .command('changeEnv')
  .description('Change the environment for the current project')
  .action(changeEnv);

// Config
config(program);

// Status
program.command('status').description('Get the status of the current project').action(status);
program.version('1.0.0');

program.parse();
