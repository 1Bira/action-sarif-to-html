import SarifReportFinder from '../sarif/SarifReportFinder';
import {SarifFile} from '../sarif/SarifDataTypes';


export type Repo = {
    owner: string,
    repo: string
  }

export default class DataCollector {    

    getPayload(sarifReportDir: string): SarifFile[] {
        const sarifFinder = new SarifReportFinder(sarifReportDir);
    
        const sarifFile = sarifFinder.getSarifFiles();

        return sarifFile;
    }
}