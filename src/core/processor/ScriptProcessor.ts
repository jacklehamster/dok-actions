import { Context } from "../context/Context";
import { DEFAULT_EXTERNALS } from "../convertor/Convertor";
import { ActionConversionMap, DEFAULT_CONVERSION_MAP, convertScripts } from "../convertor/convert-action";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script, Tag, getScriptNamesByTags } from "../scripts/Script";

export interface LoopBehavior {
    cleanupAfterLoop?: boolean;
}

export class ScriptProcessor {
    scripts: Script[];
    scriptMap: Record<string, ExecutionStep[]>;
    external: Record<string, any>;

    constructor(scripts: Script[], external: Record<string, any> = DEFAULT_EXTERNALS, actionConversionMap: ActionConversionMap = DEFAULT_CONVERSION_MAP) {
        this.scripts = scripts;
        this.scriptMap = convertScripts(this.scripts, external, actionConversionMap);
        this.external = external;
    }

    private createContext(): Context {
        return {
            parameters: [],
            cleanupActions: [],
            objectPool: [],
        };
    }

    private createLoopCleanup(behavior: LoopBehavior, context: Context) {
        const cleanupActions = context.cleanupActions;
        return behavior.cleanupAfterLoop && cleanupActions ? () => {
            for (let action of cleanupActions) {
                action();
            }
            cleanupActions.length = 0;
        } : () => {};
    }

    runByName(name: string): () => void {
        const context: Context = this.createContext();
        const steps = this.scriptMap[name];
        execute(steps, {}, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    runByTags(tags: Tag[]): () => void {
        const context: Context = this.createContext();
        const names = getScriptNamesByTags(this.scripts, tags);
        const stepsGroups = names.map(name => this.scriptMap[name]);
        stepsGroups.forEach(steps => execute(steps, {}, context));
        return () => context.cleanupActions?.forEach(action => action());
    }
    
    loopByName(name: string, behavior: LoopBehavior = {}): () => void {
        const context: Context = this.createContext();
        const parameters: ExecutionParameters = { time: 0 };
        const steps = this.scriptMap[name];
        const loopCleanup = this.createLoopCleanup(behavior, context);
        const loop = (time: number) => {
            parameters.time = time;
            execute(steps, parameters, context);
            loopCleanup();
            animationFrameId = requestAnimationFrame(loop);
        };
        let animationFrameId = requestAnimationFrame(loop);
        return () => {
            context.cleanupActions?.forEach(action => action());
            cancelAnimationFrame(animationFrameId);
        }
    }

    loopByTags(tags: string[], behavior: LoopBehavior = {}) {
        const context: Context = this.createContext();
        const parameters: ExecutionParameters = { time: performance.now() - performance.timeOrigin };
        const names = getScriptNamesByTags(this.scripts, tags);
        const stepsGroups = names.map(name => this.scriptMap[name]);
        const loopCleanup = this.createLoopCleanup(behavior, context);
        const loop = (time: number) => {
            parameters.time = time;
            for (let steps of stepsGroups) {
                execute(steps, parameters, context);
            }
            loopCleanup();
            animationFrameId = requestAnimationFrame(loop);
        };
        let animationFrameId = requestAnimationFrame(loop);
        return () => {
            context.cleanupActions?.forEach(action => action());
            cancelAnimationFrame(animationFrameId);
        }
    }
}