import { Context, createContext } from "../context/Context";
import { DEFAULT_EXTERNALS } from "../convertor/Convertor";
import { ActionConvertorList, convertScripts } from "../convertor/convert-action";
import { getDefaultConvertors } from "../convertor/default-convertors";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag, filterScripts } from "../scripts/Script";

export interface LoopBehavior {
    cleanupAfterLoop?: boolean;
}

export class ScriptProcessor<T, E = {}> {
    scripts: Script<T>[];
    scriptMap: Map<Script<T>, ExecutionStep[]>;
    external: (E|{}) & typeof DEFAULT_EXTERNALS;

    constructor(scripts: Script<T>[], external = {}, actionConversionMap: ActionConvertorList = getDefaultConvertors()) {
        this.scripts = scripts;
        this.scriptMap = convertScripts(this.scripts, external, actionConversionMap);
        this.external = {...DEFAULT_EXTERNALS, ...external};
    }

    private createLoopCleanup(behavior: LoopBehavior, context: Context) {
        const cleanupActions = context.cleanupActions;
        return behavior.cleanupAfterLoop && cleanupActions ? () => {
            for (let cleanup of cleanupActions) {
                cleanup();
            }
            cleanupActions.length = 0;
        } : () => {};
    }

    getSteps(filter: ScriptFilter) {
        const scripts = filterScripts(this.scripts, filter);
        const steps: ExecutionStep[] = [];
        scripts.forEach(script => this.scriptMap.get(script)?.forEach(step => steps.push(step)));
        return steps;
    }

    runByName(name: string): () => void {
        const context: Context = createContext();
        execute(this.getSteps({ name }), undefined, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    runByTags(tags: Tag[]): () => void {
        const context: Context = createContext();
        execute(this.getSteps({ tags }), undefined, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    private loopWithFilter(filter: ScriptFilter, behavior: LoopBehavior = {}): () => void {
        const context: Context = createContext();
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