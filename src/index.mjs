import { writeFile, mkdir, appendFile, readFile}  from "node:fs/promises";
import { argv } from "node:process";
import path from "node:path";

const args = argv.slice(2);
const date = new Date();

const currentYear = date.getFullYear();
const currentMonth = date.getMonth();
const currentDate = date.getDate();

const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
]

const logTypes = [
    'info', 'warn', 'bad-behaviour', 
    'problem', 'entertainment',
]

const flags = [
    '-t', '--type', '-c', '--content'
]

async function HandleCreateNewYearLog() {
    try {
        const directory = path.join('..', 'logs', `log-${currentYear}-year`);

        await mkdir(directory, {recursive: true});
    } catch (err) {
        console.error('An error occurred:', err);
        console.error('Probably, you typed the wrong flag. Please, use "--new-year"');
        console.error('for detailed information, see at: https://github.com/Zafkiel45/Relogs')
    };
};
async function HandleCreateNewMonthLog() {
    try {
        const currentMonth = date.getMonth();
        const directory = path.join('..', 'logs', `log-${currentYear}-year`, `${months[currentMonth]}`);

        await mkdir(directory, {recursive: true});
    } catch (err) {
        console.error('An error ocurred', err);
        console.error('please, check if the folder of year exists');
        console.error('if you do not known as create the year folder, see at: https://github.com/Zafkiel45/Relogs')
    };
};
async function HandleCreateNewDayLog() {
    try {
        const directory = `../logs/log-${currentYear}-year/${months[date.getMonth()]}/${date.getDate()}-day.log`
        await writeFile(directory, '');
    } catch (err) {
        console.error('An error occurred:', err); 
        console.error('check if the folder of year exists.');
        console.error('check if the folder of month exists.');
        console.error('if you do not known as create the folders, see at: https://github.com/Zafkiel45/Relogs')
    };
};
async function HandleAddNewLog() {
    try {
        // improve code:
        // It is possible reduce the find function repetition creating other 
        // function. However, this have to be done in other commit 
        const typeFlagExits = flags.find((item) => {
            return args[1] === item;
        });
        const contentFlagExists = flags.find((item) => {
            return args[3] === item;
        });
        // args 1 is the flag "--type"
        // args 2 is the value for the flag "--type" 
        // args 3 is the flag "--content" 
        // args 4 is the value for the flag "--content" 
        if(typeFlagExits && args[2] && args[3] === contentFlagExists) {
            const directory = path.join('..', 'logs', `log-${currentYear}-year`, `${months[currentMonth]}`, `${currentDate}-day.log`);
            let logType = '';
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            if(logTypes.includes(args[2])) {
                logType = `[${[args[2].toUpperCase().trim()]}]: `;
            } else {
                console.error(`this type: ${args[2]} doesn't exist`);
                console.error(`please, use some of thoses types: ${logTypes}`);
            };

            let logContent = '\n' +logType + String(args[4]) + ' at ' + `${hours}:${minutes}:${seconds}`;

            await appendFile(directory, logContent);
        } else {
            console.error('Ops... Seems that you used a wrong flag!');
            console.error('Or forgotted to pass the values...');
            console.error('Please, use some of thoses flags', flags);
            console.error('make sure to use the correct flags');
            console.error('more information on: https://github.com/Zafkiel45/Relogs') 
        };
    } catch (err) {
        console.error('An error occurred:', err);
    };
};
async function HandleReadLog() {
    try {
        if(args[1] && args[2] && args[3]) {

            const year = Number(args[1]);
            const month = String(args[2]);
            const date = Number(args[3]);

            const directory = path.join('..', 'logs', `log-${year}-year`, `${month}`, `${date}-day.log`);
            const logContent = await readFile(directory);

            HandleStyleConsole(logContent.toString().trim().split('\n'));
        } else {
            throw new Error('some arguments is missing');
        }
    } catch (err) {
        console.error(err);
        console.error('Please, pass the year follow by month(the first three characters in english) and log date');
    };
};
function HandleStyleConsole(content) {
    Array.from(content).forEach((item) => {
        const currentLine = item.split(' ');
        const contentWithoutType = '\x1b[0m' + currentLine.slice(1).join(' ');
        const logType = currentLine[0]

        switch(logType) {
            case '[INFO]:':
                console.log(`\x1b[32m${logType}`, contentWithoutType);
            break
            case '[BAD-BEHAVIOUR]:':
                console.log(`\x1b[31m${logType}`, contentWithoutType);
            break
            case '[PROBLEM]:':
                console.log(`\x1b[31m${logType}`, contentWithoutType);
            break
            case '[WARN]:':
                console.log(`\x1b[33m${logType}`, contentWithoutType);
            break
            case '[ENTERTAINMENT]:':
                console.log(`\x1b[34m${logType}`, contentWithoutType);
            break
        }
    });
};

switch(args[0]) {
    case '--new-year':
        HandleCreateNewYearLog();
    break 
    case '--new-month':
        HandleCreateNewMonthLog();
    break 
    case '--new-day':
        HandleCreateNewDayLog();
    break  
    case '--add-register':
        HandleAddNewLog();
    break 
    case '--read-log':
        HandleReadLog();
    break
    default:
        console.log('none options was selected');
}