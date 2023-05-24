import { DokAction } from "../actions/Action";
import { Context } from "../context/Context";
import { ExecutionStep } from "../execution/ExecutionStep";
import { Script } from "../scripts/Script";
export declare type Convertor = (action: DokAction, getSteps: (name: string) => ExecutionStep[], external?: Record<string, any>) => ExecutionStep | undefined;
export declare const DEFAULT_EXTERNALS: {
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
};
export declare const convertAction: Convertor;
export declare const DEFAULT_CONVERTORS: {
    log: Convertor;
    "execute-script": Convertor;
    actionAction: Convertor;
};
export declare function convertScripts(scripts: Script[], convertors?: Record<string, Convertor>, external?: Record<string, any>): Record<string, ExecutionStep[]>;
export declare function executeScript(scriptName: string, scripts: Script[], context: Context, convertors?: Record<string, Convertor>, external?: Record<string, any>): void;
