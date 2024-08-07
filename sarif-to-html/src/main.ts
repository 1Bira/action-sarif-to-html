import * as core from '@actions/core';
import {ReportGenerator} from "./report/ReportGenerator";
import execTemplate from "./tests/execTemplate";



export function run() {
    try {
        core.info(`[✅] Start Action]`);
        const sarifReporDir: string = core.getInput('sarifReportDir');
        core.info(`Find Sarif file in ${sarifReporDir} ...`);

        const outputDir: string = core.getInput('outputDir');
        core.info(`Find Sarif file in ${outputDir} ...`);
        // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
        

        // Log the current timestamp, wait, then log the new timestamp
        core.debug(new Date().toTimeString())
        const generator =  new ReportGenerator();
        generator.run();
        core.debug(new Date().toTimeString())

        // Set outputs for other workflow steps to use
        core.setOutput('time', new Date().toTimeString())
    } catch (error) {
      // Fail the workflow run if an error occurs
      if (error instanceof Error) core.setFailed(error.message)
    }
  }