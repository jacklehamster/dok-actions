import { Context, createContext } from "../context/Context";
import { ActionConvertorList, convertScripts } from "../convertor/convert-action";
import { getDefaultConvertors } from "../convertor/default-convertors";
import { DEFAULT_EXTERNALS } from "../convertor/default-externals";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag, filterScripts } from "../scripts/Script";

export interface LoopBehavior {
    cleanupAfterLoop?: boolean;
}

export class ScriptProcessor<T, E = {}> {
    private scripts: Script<T>[];
    private scriptMap?: Map<Script<T>, ExecutionStep[]>;
    private external: (E|{}) & typeof DEFAULT_EXTERNALS;
    private actionConversionMap: ActionConvertorList;

    constructor(scripts: Script<T>[], external = {}, actionConversionMap: ActionConvertorList = getDefaultConvertors()) {
        this.scripts = scripts;
        this.actionConversionMap = actionConversionMap;
        this.external = {...DEFAULT_EXTERNALS, ...external};
    }

    private async fetchScripts(): Promise<Map<Script<T>, ExecutionStep[]>> {
        if (!this.scriptMap) {
            this.scriptMap = await convertScripts(this.scripts, this.external, this.actionConversionMap);
        }
        return this.scriptMap!;
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

    async getSteps(filter: ScriptFilter) {
        const scriptMap = await this.fetchScripts();
        const scripts = filterScripts(this.scripts, filter);
        const steps: ExecutionStep[] = [];
        scripts.forEach(script => scriptMap.get(script)?.forEach(step => steps.push(step)));
        return steps;
    }

    async runByName(name: string) {
        const context: Context = createContext();
        execute(await this.getSteps({ name }), undefined, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    async runByTags(tags: Tag[]) {
        const context: Context = createContext();
        execute(await this.getSteps({ tags }), undefined, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    private async loopWithFilter(filter: ScriptFilter, behavior: LoopBehavior = {}) {
        const context: Context = createContext();
        const parameters: ExecutionParameters = { time: 0 };
        const steps = await this.getSteps(filter);
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
    
    async loopByName(name: string, behavior: LoopBehavior = {}) {
        return await this.loopWithFilter({ name }, behavior);
    }

    async loopByTags(tags: string[], behavior: LoopBehavior = {}) {
        return await this.loopWithFilter({ tags }, behavior);
    }
}