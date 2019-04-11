import { HTMLDataTable } from './component/HTMLDataTable.js';

//testing with this data array
let data = [[ 0, "DataColumnA-0", "DataColumnB-0", true],[ 1, "DataColumnA-1", "DataColumnB-1", true],[ 1, "DataColumnA-2", "DataColumnB-2", false ],[ 3, "DataColumnA-3", "DataColumnB-3", true ],[ 4, "DataColumnA-4", "DataColumnB-4", false ],[ 5, "DataColumnA-5", "DataColumnB-5", true ],[ 6, "DataColumnA-6", "DataColumnB-6", false ],[ 7, "DataColumnA-7", "DataColumnB-7", true ],[ 8, "DataColumnA-8", "DataColumnB-8", false ],[ 9, "DataColumnA-9", "DataColumnB-9", true ],[ 10, "DataColumnA-10", "DataColumnB-10", false ],[ 11, "DataColumnA-11", "DataColumnB-11", true ],[ 12, "DataColumnA-12", "DataColumnB-12", false ],[ 13, "DataColumnA-13", "DataColumnB-13", true ],[ 14, "DataColumnA-14", "DataColumnB-14", false ],[ 15, "DataColumnA-15", "DataColumnB-15", true ],[ 16, "DataColumnA-16", "DataColumnB-16", false ],[ 17, "DataColumnA-17", "DataColumnB-17", true ],[ 18, "DataColumnA-18", "DataColumnB-18", false ],[ 19, "DataColumnA-19", "DataColumnB-19", true ],[ 20, "DataColumnA-20", "DataColumnB-20", false ],[ 21, "DataColumnA-21", "DataColumnB-21", true ],[ 22, "DataColumnA-22", "DataColumnB-22", true ],[ 23, "DataColumnA-23", "DataColumnB-23", true ],[ 24, "DataColumnA-24", "DataColumnB-24", true ],[ 25, "DataColumnA-25", "DataColumnB-25", true ],[ 26, "DataColumnA-26", "DataColumnB-26", false ],[ 27, "DataColumnA-27", "DataColumnB-27", false ],[ 28, "DataColumnA-28", "DataColumnB-28", false ],[ 29, "DataColumnA-29", "DataColumnB-29", true ],[ 30, "DataColumnA-30", "DataColumnB-30", true ],[ 31, "DataColumnA-31", "DataColumnB-31", true ],[ 32, "DataColumnA-32", "DataColumnB-32", false ],[ 33, "DataColumnA-33", "DataColumnB-33", false ],[ 34, "DataColumnA-34", "DataColumnB-34", false ],[ 35, "DataColumnA-35", "DataColumnB-35", false ],[ 36, "DataColumnA-36", "DataColumnB-36", true ],[ 37, "DataColumnA-37", "DataColumnB-37", true ],[ 38, "DataColumnA-38", "DataColumnB-38", false ],[ 39, "DataColumnA-39", "DataColumnB-39", false ],[ 40, "DataColumnA-40", "DataColumnB-40", true ]];

let table = new HTMLDataTable();

data.forEach( item => table.innerModel.insert(item) );

document.body.appendChild(table);

document.table = table;
