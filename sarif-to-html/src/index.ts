import { ReportGenerator } from "./report/ReportGenerator";
import execTemplate from "./tests/execTemplate";


function run(){

    executeApp();
    //executeDemo();
}

run();


function executeDemo(){
    console.log("Executing Demo");
    const generateAlertSummary = new execTemplate();
    console.log(generateAlertSummary.run());
}

function executeApp(){
    console.log("Executing App");
    const generator =  new ReportGenerator();
    generator.run();
}