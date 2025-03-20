#!/usr/bin/env node

import { Command } from 'commander';
import { login } from './commands/login';
import { pull } from './commands/pull';
import { push } from './commands/push';
import { logOut } from './commands/logOut';

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

program.version('1.0.0');

program.parse();
