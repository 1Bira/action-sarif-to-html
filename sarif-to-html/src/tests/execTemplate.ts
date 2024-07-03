import * as fs from 'fs';
//import { expect } from 'chai';
import Template from '../Template';
//import * as path from 'path';


//const chai = require("chai");
const path = require('path');


export type ReportingEx = {
    directory: string,
    json: string,
    expectedSummary: string,    
} 

const OCTODEMO_GHAS_REPORTING : ReportingEx= {
  directory: 'octodemo/ghas-reporting',
  json: 'payload.json',
  expectedSummary: 'summary.html'
};


export default class execTemplate {
    run(): any {
        [OCTODEMO_GHAS_REPORTING].forEach(config => {

            const reporting = new Template()
                , data = readSampleFileAsJson(config.directory, 'payload.json')
                , fileContent = reporting.render(data, 'summary')
              ;
            console.log(`LOG: ${fileContent}`);
              fs.writeFileSync(getTestDirectoryFilePath(config.directory, 'summary.html'), fileContent);
        
              const expectedContent = getExpectedContents(config);
              //chai.expect(fileContent).to.equal(expectedContent);
          });
    }
}

function getExpectedContents(config: ReportingEx) {
  const content = fs.readFileSync(getSampleReportJsonDirectory(config.directory, config.expectedSummary));
  console.log(`LOG : ${config.directory} : ${config.expectedSummary}`)
  return content.toString('utf-8');
}


function readSampleFileAsJson(subDir: string, file:string) {
  const content = fs.readFileSync(getSampleReportJsonDirectory(...[subDir, file]));
  return JSON.parse(content.toString('utf-8'));
}


function getSampleReportJsonDirectory(...dir: string[]): string {
    const args = [__dirname, '..', 'samples', 'reportJson', ...dir];
    return path.join(...args);
  }

function getTestDirectoryFilePath(...filePath: string[]): string {
    const args = [__dirname, '..', '_tmp', ...filePath];
    return path.join(...args);
  }