import { writeFile, mkdir }  from "node:fs/promises";
import path from "node:path";
import { argv } from "node:process";

const args = argv.slice(2);
const date = new Date();
const currentYear = date.getFullYear();

const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
]
async function HandleCreateNewLog() {
    try {
        const directory = path.join('..', 'logs', `log-${currentYear}-year`);

        await mkdir(directory, {recursive: true});
    } catch (err) {
        console.error('An error occurred:', err);
    };
};
async function HandleCreateNewMonthLog() {
    try {
        const currentMonth = date.getMonth();
        const directory = path.join('..', 'logs', `log-${currentYear}-year`, `${months[currentMonth]}`);

        await mkdir(directory, {recursive: true});
    } catch (err) {
        console.error('An error ocurred', err);
    };
};
async function HandleCreateNewDayLog() {
    try {
        const directory = `../logs/log-${currentYear}-year/${months[date.getMonth()]}/${date.getDate()}-day.log`
        await writeFile(directory, '');
    } catch (err) {
        console.error('An error occurred:', err); 
    };
};


switch(args[0]) {
    case '--new-year':
        HandleCreateNewLog();
    break 
    case '--new-month':
        HandleCreateNewMonthLog();
    break 
    case '--new-day':
        HandleCreateNewDayLog();
    break  
    default:
        console.log('none options was selected');
}