import { Context } from "../context/Context";
import { DEFAULT_EXTERNALS } from "../convertor/Convertor";
import { ActionConvertorList, DEFAULT_CONVERTORS, convertScripts } from "../convertor/convert-action";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag, filterScripts } from "../scripts/Script";

export interface LoopBehavior {
    cleanupAfterLoop?: boolean;
}

export class ScriptProcessor<T> {
    scripts: Script<T>[];
    scriptMap: Map<Script<T>, ExecutionStep[]>;
    external: Record<string, any>;

    constructor(scripts: Script<T>[], external: Record<string, any> = DEFAULT_EXTERNALS, actionConversionMap: ActionConvertorList = DEFAULT_CONVERTORS) {
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

    private getSteps(filter: ScriptFilter) {
        const scripts = filterScripts(this.scripts, filter);
        const steps: ExecutionStep[] = [];
        scripts.forEach(script => this.scriptMap.get(script)?.forEach(step => steps.push(step)));
        return steps;
    }

    runByName(name: string): () => void {
        const context: Context = this.createContext();
        execute(this.getSteps({ name }), undefined, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    runByTags(tags: Tag[]): () => void {
        const context: Context = this.createContext();
        execute(this.getSteps({ tags }), undefined, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    private loopWithFilter(filter: ScriptFilter, behavior: LoopBehavior = {}): () => void {
        const context: Context = this.createContext();
        const parameters: ExecutionParameters = { time: 0 };
        const steps = this.getSteps(filter);
        const loopCleanup = this.createLoopCleanup(behavior, context);
        const loop = (time: number) => {
            parameters.time = time;
            execute(steps, parameters, context);
            loopCleanup();
            animationFrameId = requestAnimationFrame(loop);
        };
        let animationFrameId = requestAnimationFrame(loop);
        return () => {
            loopCleanup();
            cancelAnimationFrame(animationFrameId);
        }
    }
    
    loopByName(name: string, behavior: LoopBehavior = {}): () => void {
        return this.loopWithFilter({ name }, behavior);
    }

    loopByTags(tags: string[], behavior: LoopBehavior = {}) {
        return this.loopWithFilter({ tags }, behavior);
    }
}