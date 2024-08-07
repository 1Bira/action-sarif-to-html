
import { version } from 'os';
import CodeScanningRule from '../CodeScanningRule';
import DataCollector from '../data/DataCollector';
import ReportData from './ReportData';
import { CodeScanningRules } from './ReportTypes';
import {SarifReportData, SarifResult, SarifRule, SarifRun} from '../sarif/SarifDataTypes';
import SarifReport from '../sarif/SarifReport';
import Template from '../Template'; 
import { ReportingEx } from '../tests/Template.test';
import * as fs from 'fs';
import { getTestDirectoryFilePath } from '../testUtils';
import * as core from '@actions/core';

const OCTODEMO_GHAS_REPORTING : ReportingEx= {
    directory: 'octodemo/ghas-reporting',
    json: 'payload.json',
    expectedSummary: 'summary.html'
  };


export class ReportGenerator {
    run(): string {
        core.info(`[✅] Start Action]`);
        let sarifresults: SarifResult[] = [];
        let sarifRules: CodeScanningRule;
        
        core.info(`[✅] Load File Sarif]`);
        const collector = new DataCollector();
        let sariflist = collector.getPayload("/home/bpiuser/Documents/repos/js/sarif-to-html/results/");
        //console.log(sariflist[0].payload.data);
        sariflist.forEach(sarif => {
            const sarifresults = sarif.payload.data.runs[0].results;
            const sarifRules = codeScanningRules(sarif.payload.data.runs[0]);    
            //console.log(`CWES : ${sarifRules[Object.keys(sarifRules)[2]].cwes}`);                 
        });

        const sarifReportData: SarifReportData = {
            version: "2.1.1",
            runs: sariflist[0].payload.data.runs
        };

        
        const reportData :ReportData = new ReportData(sarifReportData);

        //console.log(reportData.getJSONPayload().scanning.rules[0]);
        core.info(`[✅] Create Files]`);
        const reporttemplate = new Template();
        const fileContent = reporttemplate.render(reportData.getJSONPayload(), 'summary');

        fs.writeFileSync(getTestDirectoryFilePath('summaryf.html'), fileContent);
        core.info(`[✅] End Action]`);
        //console.log(fileContent);
        //reporttemplate.render(data.getJSONPayload(), fileContent = reporting.render(data, 'summary'))

        /*results.forEach(result => {
            console.log(result.ruleId);
        });*/
       
        return "ok";

    }

    
}

function codeScanningRules(datarun: SarifRun): CodeScanningRules {
    const result: CodeScanningRules = {};
    
    if (datarun) {
        console.log(`datarun.tool.driver.rules.length: ${datarun.tool.driver.rules.length}`);
        if (datarun.tool.driver.rules.length > 0) {
            datarun.tool.driver.rules.forEach(rule => {
                
                result[rule.id] = new CodeScanningRule(rule);
            });
  
        } else {
            console.log(`datarun.tool.extensions[0].rules: ${datarun.tool.extensions[0].rules.length}`);
            datarun.tool.extensions[0].rules.forEach(rule => {
                result[rule.id] = new CodeScanningRule(rule);
            });
        }                        
    }
    console.log(`codeScanningRules(datarun: SarifRun): ${Object.keys(result).length}`);
    return result;
}




