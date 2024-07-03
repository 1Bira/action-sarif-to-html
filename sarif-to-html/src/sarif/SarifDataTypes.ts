import SarifReport from './SarifReport'

export type SarifReportData = {
    version: string,
    runs: SarifRun[],
  }
  
  export type SarifRun = {
    tool: {
      driver: {
        name: string,
        rules: SarifRule[]        
      },
      extensions: [{
        name: string,
        rules: SarifRule[],
      }]
    },
    results : SarifResult[],
  }
  
  
  export type SarifResult = {
    ruleId: string
    location : {
      physicalLocation : {
        artifactLocation : [{
          uri: string
        }]
      }
    },
    message: {
      text: string
    },
  }
  

  export type SarifRule = {
    id: string,
    name: string,
    shortDescription: {
      text: string,
    },
    fullDescription: {
      text: string,
    },
    properties: {
      tags: string[],
      precision: string,
      kind: string,
      "security-severity": string,
  
    },
    defaultConfiguration: {
      level: string,
    }
  }

  export type SarifFile = {
    file: string,
    payload: SarifReport
  }

  export type Manifest = {
    filename: string,
    path: string,
  }
  
  export type Dependencies = {
    [key: string]: Dependency[]
  }
  
  export type Dependency = {
    name: string,
    type: string,
    version: string
  }