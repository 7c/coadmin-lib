"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const ts_1 = require("mybase/ts");
const ReportIssues = require('../models/ReportIssues.js');
const VALID_LEVELS = ['warning', 'error', 'info', 'debug', 'fatal'];
function validateArgs(args) {
    const errors = [];
    if (!args.app) {
        errors.push('--app is required');
    }
    else if (args.app.length < 3) {
        errors.push('--app must be at least 3 characters long');
    }
    if (!args.description) {
        errors.push('--description is required');
    }
    else if (args.description.length < 3) {
        errors.push('--description must be at least 3 characters long');
    }
    if (!args.level) {
        errors.push('--level is required');
    }
    else if (!VALID_LEVELS.includes(args.level)) {
        errors.push(`--level must be one of: ${VALID_LEVELS.join(', ')}`);
    }
    // Validate live mode options
    if (args.live) {
        if (!args.server) {
            errors.push('--server is required in live mode');
        }
        else {
            try {
                new URL(args.server);
            }
            catch (error) {
                errors.push('--server must be a valid URL');
            }
        }
        if (!args.server_path) {
            errors.push('--server_path is required in live mode');
        }
        else if (!args.server_path.startsWith('/')) {
            errors.push('--server_path must start with "/"');
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
function showUsage() {
    console.log(`
Usage: cli [command] [subcommand] [options]

Commands:
    issue submit    Submit a new issue
        Options:
            --app <string>          Application name (min 3 chars)
            --description <string>   Issue description (min 3 chars)
            --level <string>        Issue level (warning|error|info|debug|fatal)
            --live                  Enable live mode (optional)
            --server <url>          Server URL (required if live mode is enabled)
            --server_path <string>  Server path (required if live mode is enabled; must start with '/')

Example:
    cli issue submit --app myapp --description "Something went wrong" --level error
    `);
}
async function main() {
    const args = (0, minimist_1.default)(process.argv.slice(2), {
        string: ['app', 'description', 'level', 'server', 'server_path'],
        boolean: ['live'],
        unknown: (arg) => {
            if (arg.startsWith('-')) {
                console.error(`Unknown option: ${arg}`);
                process.exit(1);
            }
            return true;
        },
    });
    const [command, subcommand] = args._;
    if (!command) {
        showUsage();
        process.exit(0);
    }
    switch (command) {
        case 'issue':
            switch (subcommand) {
                case 'submit':
                    const validation = validateArgs(args);
                    if (!validation.isValid) {
                        console.error('Error: Invalid arguments');
                        validation.errors.forEach(error => console.error(`- ${error}`));
                        process.exit(1);
                    }
                    // For now, just display the parameters
                    console.log('Submitting issue with parameters:');
                    console.log(`App: ${args.app}`);
                    console.log(`Description: ${args.description}`);
                    console.log(`Level: ${args.level}`);
                    if (args.live) {
                        const ri = new ReportIssues(args.app, {
                            live: true,
                            server: args.server,
                            server_path: args.server_path,
                        });
                        ri.add(args.description, {}, args.level);
                        // lets give buffer processor time to send the issue
                        await (0, ts_1.wait)(2);
                        if (ri.buffer.length == 0) {
                            console.log('Issue submitted successfully');
                            process.exit(0);
                        }
                        else {
                            console.error('Issue submission failed');
                            process.exit(1);
                        }
                    }
                    else {
                        const ri = new ReportIssues(args.app, { live: false });
                        if (ri.add(args.description, {}, args.level)) {
                            console.log('Issue submitted successfully');
                            process.exit(0);
                        }
                        else {
                            console.error('Issue submission failed');
                            process.exit(1);
                        }
                    }
                default:
                    console.error('Error: Unknown subcommand for "issue"');
                    showUsage();
                    process.exit(1);
            }
        default:
            console.error('Error: Unknown command');
            showUsage();
            process.exit(1);
    }
}
main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map