import * as fs from "fs";
import SarifReport from './SarifReport'
import path from "path";
import {SarifFile} from "./SarifDataTypes"

export default class SarifReportFinder {
    private readonly dir: string;

    constructor(dir: string){
        this.dir = dir;
    }

     getSarifFiles(): SarifFile[] {
        const dir = this.dir;
        let sarifFile: SarifFile[] =  [];

        if (!(filepath(dir))) {
            throw new Error(`Sarif file, path ${dir}`);
            console.log(`Sarif file, path ${dir}`);            
        }

        if (fs.lstatSync(dir).isDirectory()) {
            console.log(`[V] Sarif File Finder, path: ${dir}`);

            const files = fs.readdirSync(dir)
                        .filter(f => f.endsWith('.sarif'))
                        .map(f => path.resolve(dir, f));

            if (files.length > 0) {
                sarifFile = files.map(f=> loadFileContents(f));
            }
        }

        return sarifFile;
    }
}

function loadFileContents(file: string): SarifFile {

    try {
        const content = fs.readFileSync(file, 'utf8');
        const data = JSON.parse(content);
        return {
            file: file,
            payload: new SarifReport(data)
        }    
    } catch (error) {
        throw new Error(`Failed to parser JSON from SARIF file ${file}: ${error}`);        
    }
}

function filepath(filepath: string): boolean {
    try {
        fs.accessSync(filepath);
        return true;
    } catch (error) {
        return false;
    }
} 