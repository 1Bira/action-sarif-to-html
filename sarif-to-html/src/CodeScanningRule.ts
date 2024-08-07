import { RuleData } from './report/ReportTypes';
import {SarifRule} from './sarif/SarifDataTypes';
import SarifReport from './sarif/SarifReport';

const CWE_REGEX = /external\/cwe\/(cwe-.*)/;

export default class CodeScanningRule {

    private sarifRule: SarifRule;
    private ruleData?: RuleData;
  
    readonly cwes: string[];

    
    constructor(sarifRule: SarifRule) {      
        this.sarifRule = sarifRule;
        //this.ruleData = ruleData ?? undefined; 
        //this.sarifRule = CodeScanningRule.RuleDataToSarifRule(this.ruleData);

      this.cwes = CodeScanningRule.getCWEs(this.sarifRule.properties.tags);
    }
  
    get id(): string {
      return this.sarifRule.id;
    }
  
    get name() : string{
      return this.sarifRule.name;
    }
  
    get shortDescription(): string {
      return this.sarifRule.shortDescription.text;
    }
  
    get description(): string {
      return this.sarifRule.fullDescription.text;
    }
  
    get tags(): Array<string> {
      return this.sarifRule.properties.tags;
    }
  
    get severity(): string {
      return this.sarifRule.defaultConfiguration.level;
    }
  
    get precision() : string{
      return this.sarifRule.properties.precision;
    }
  
    get kind() : string{
      return this.sarifRule.properties.kind;
    }
  
    get defaultConfigurationLevel(): string {
      return this.sarifRule.defaultConfiguration.level;
    }

    static RuleDataToSarifRule(ruleData: RuleData): SarifRule {
      let sarifRule: SarifRule = {
            id :  ruleData.name,
            name: ruleData.name,
            defaultConfiguration:{
              level: ruleData.severity
            }, 
            shortDescription: {
              text: ruleData.shortDescription
            },
            fullDescription : {
              text: ruleData.description,
            },      
            properties : {
              kind : ruleData.kind,
              precision : ruleData.precision,
              "security-severity": ruleData.severity,
              tags: ruleData.tags
            }
          };
      return sarifRule;
    }

    static getCWEs(tags: string[]): string[] {
      const cwes: string[] = [];
    
      if (tags) {
        tags.forEach(tag => {
          const match = CWE_REGEX.exec(tag);
    
          if (match) {
            // @ts-ignore
            cwes.push(match[1]);
          }
        });
      }
    
      return cwes.sort();
    }

  }
  
  


  