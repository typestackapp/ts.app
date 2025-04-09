import { distance } from "fastest-levenshtein"
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'
import { transform } from 'stream-transform'
import moment from "moment"
import fs from "fs-extra"
import _ from 'lodash'

export async function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

/**
 * Check two string similarity
 * @returns % as float
 */
export function similarity(s1: string, s2: string): number {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - distance(longer, shorter)) / longerLength;
}

/**
 * Check two string array similarity
 * @returns % as float
 */
export function arraySimilarity(s1: string[], s2: string[], treshold: number): number[] {
    const _sim: number[] = []
    // foreach name calculate similarity with _find
    for(const f of s1) {
        const _f = f.toLowerCase()
        for(const name of s2) {
            const _name = name.toLowerCase()
            const sim = similarity(_f, _name)
            if(sim >= treshold) {
                // push at the end of results
                _sim.push(sim)
                break
            }
        }
    }
    return _sim
}


/**
 * Get number array average value
 * @returns float
 */
export function average(arr: any[]): number {return arr.reduce((a: any, b: any) => a + b, 0) / arr.length}

export enum FetchMethod {
    POST = "POST",
    GET = "GET"
}

export const mockFetchReqBrowserHeaders = {
    "accept": "application/json;charset=UTF-8",
    "accept-language": "en-GB,en;q=0.9,lv-LV;q=0.8,lv;q=0.7,en-US;q=0.6,es;q=0.5",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
}

/**
 * Removes and tranforms csv file columns and headers
 */
 export async function csvTransfrom( input_file: string, output_file: string, columns: any[], delimiter: string ) {
    return new Promise<any>(( res, rej ) => {
        fs.createReadStream(input_file)
        .pipe(parse({ delimiter, columns: true }))
        .pipe(
            transform((input: any) => {
                var output_row: { [key: string]: string; } = {}
                for(const column of columns){
                    if(column.type == "date"){
                        output_row[column.to] = (input[column.from])? moment(encodeCsvString(input[column.from])).format('YYYY-M-DD') : `NULL`
                    }else{
                        output_row[column.to] = (input[column.from])? encodeCsvString(input[column.from]) : `NULL`
                    }
                }
                //console.log(output_row)
                return output_row
            })
        )
        .pipe(stringify({ header: true, delimiter }))
        .pipe(fs.createWriteStream(output_file))
        .on('finish', () => {
            res({data: "csv-tranform-ok"})
        })
        .on('error', (err) => {
            console.log(err)
            // rej({error:"csv-cant-transfrom-file", msg: `Error while transforming file:${input_file}`})
        });
    });
}

export const defaultXmlOptions = {
    attributeNamePrefix : "_",
    //attrNodeName: false,
    //textNodeName : "#text",
    ignoreAttributes : false,
    ignoreNameSpace: false,
}

/**
 * properly encodes string for CSV file
 */
function encodeCsvString(string: string) {
    string = string.replace(/"/g, '""');
    string = string.replace(/,/g, '\,');
    string = string.replace(/'/g, '\'');
    return string;
}