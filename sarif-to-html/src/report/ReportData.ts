import {SarifReportData} from '../sarif/SarifDataTypes';
import { AlertSummary, CWECoverage, CodeScanResults, DependencySummary, CodeScanSummary,JsonPayload, RuleData, ServerityToVulnerabilities, SeverityToAlertSummary } from './ReportTypes';
import { CodeScanningRules } from './ReportTypes';
import Vulnerability from '../Vulnerability';
import CodeScanningRule from '../CodeScanningRule';


export default class ReportData {

    private readonly data: SarifReportData;

    constructor(data: SarifReportData) {
        this.data = data || {};
    }

    get codeScanningRules(): CodeScanningRules {
        const result: CodeScanningRules = {};
    
        if (this.data.runs) {
         
            if (this.data.runs[0].tool.driver.rules.length > 0) {
                this.data.runs[0].tool.driver.rules.forEach(rule => {
                    result[rule.id] = new CodeScanningRule(rule);
                });
      
            } else {
                this.data.runs[0].tool.extensions[0].rules.forEach(rule => {
                    result[rule.id] = new CodeScanningRule(rule);
                });
            }                        
        }
    
        return result;
    }

    get openDependencyVulnerabilitiesLenth(): number {
        return 28
    }

    getJSONPayload(): JsonPayload {
        const data : JsonPayload =  {
          github: {
            repo:"Repo XPT0",
            owner:"1bira" 
          },
          metadata: {
            created: new Date().toISOString(),
          },
          sca: {
            dependencies: this.getDependencySummary(),
            vulnerabilities: {
              total: this.openDependencyVulnerabilitiesLenth,
              bySeverity: {}
            },
          },
          scanning: {
            rules: this.getAppliedCodeScanningRules(),
            cwe: this.getCWECoverage() || {},
            //@ts-ignore
            results: this.getCodeScanSummary(),
          }
        };
        return data;
    }

    getDependencySummary(): DependencySummary {
        const dependency: DependencySummary = 
        {
            manifests: {
                processed:[],
                unprocessed: [],
            },
            totalDependencies: 0,
            dependencies: {},                
        };
        return dependency;
    }

    getVulnerabilitiesBySeverity(vulnerabilities: Vulnerability[]): ServerityToVulnerabilities {

        const result: ServerityToVulnerabilities = {};
    
        // Obtain third party artifacts ranked by severity
        vulnerabilities.forEach(vulnerability => {
          const severity = vulnerability.severity.toLowerCase();
    
          if (!result[severity]) {
            result[severity] = [];
          }
          result[severity].push(vulnerability);
        });
    
        return result;
    }


    getAppliedCodeScanningRules(): RuleData[] {
        const rules = this.data.runs[0].tool.extensions[0].rules;
    
        const rulesdata : RuleData[]= [];

        if (rules) {
          Object.values(rules).map(rule => {
            
            rulesdata.push({
                cwe:rule.properties.tags,
                description: rule.fullDescription.text,
                kind: rule.name,
                name: rule.name,
                precision: rule.properties.precision,
                severity: rule.properties.precision,
                shortDescription: rule.fullDescription.text,
                tags: rule.properties.tags

            })
            
          });
        }
    
        return rulesdata;
    }
    
    // @ts-ignore
    getCWECoverage(): CWECoverage | null {
        const rules = this.getAppliedCodeScanningRules();
    
        if (rules) {
          const result: {[key: string]: RuleData[]} = {};
    
          rules.forEach(rule => {
            const cwes = rule.cwe;
    
            if (cwes) {
              cwes.forEach(cwe => {
                if (!result[cwe]) {
                  result[cwe] = [];
                }
                // @ts-ignore
                result[cwe].push(rule);
              });
            }
          });
    
          return {
            cweToRules: result,
            cwes: Object.keys(result)
            };
        }
    }

    
    getCodeScanSummary(): CodeScanSummary {
    
        const now = new Date();
        const alerts: AlertSummary[] = []
        const severityAlertSumary: SeverityToAlertSummary= {};

        this.data.runs[0].results.forEach(result => {
            
            const  alert: AlertSummary = {
                state: "open",
                rule : {
                    id: result.ruleId,                    
                },
                created: now.toISOString(),
                name:result.ruleId,
                tool:this.data.runs[0].tool.driver.name,
                url:result.location?.physicalLocation.artifactLocation[0].uri,
                
            };

            alerts.push(alert);
        });

        severityAlertSumary["error"] = alerts;



        const codeScanResult : CodeScanResults = {
            total:this.data.runs[0].results.length,
            scans: severityAlertSumary
        }

        const data = {
          open: codeScanResult,
          close: codeScanResult
        };        
        
        return data;
      }
    
    

}



/*function generateAlertSummary(open: CodeScanningResults, rules: CodeScanningRules): CodeScanResults {
    const result: SeverityToAlertSummary = {};
    let total = 0;
  
    open.getCodeQLScanningAlerts().forEach(codeScanAlert => {
      const severity = codeScanAlert.severity
        , matchedRule = rules ? rules[codeScanAlert.ruleId] : null
      ;
  
      const summary: AlertSummary = {
        tool: codeScanAlert.toolName,
        name: codeScanAlert.ruleDescription,
        state: codeScanAlert.state,
        created: codeScanAlert.created,
        url: codeScanAlert.url,
        rule: {
          id: codeScanAlert.ruleId,
        }
      };
  
      if (matchedRule) {
        summary.rule.details = matchedRule;
      }
  
      if (!result[severity]) {
        result[severity] = [];
      }
      result[severity].push(summary);
      total++;
    });
  
    return {
      total: total,
      scans: result
    };
}*/

function getRuleData(rule: CodeScanningRule): RuleData {
    return {
      name: rule.name,
      //TODO maybe id?
      severity: rule.severity,
      precision: rule.precision,
      kind: rule.kind,
      shortDescription: rule.shortDescription,
      description: rule.description,
      tags: rule.tags,
      cwe: rule.cwes,
    };
}


