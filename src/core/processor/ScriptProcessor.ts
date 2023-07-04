import { Context, createContext } from "../context/Context";
import { ConvertorSet } from "../convertor/Convertor";
import { convertScripts } from "../convertor/actions/convert-action";
import { getDefaultConvertors } from "../convertor/default-convertors";
import { DEFAULT_EXTERNALS } from "../convertor/default-externals";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag, filterScripts } from "../scripts/Script";

export interface RefreshBehavior {
    frameRate?: number;
    cleanupAfterRefresh?: boolean;
    parameters?: ExecutionParameters;
}

export interface ScriptProcessorHelper {
    refreshSteps(steps: ExecutionStep[], behavior?: RefreshBehavior, processId?: string): () => void;
    stopRefresh(processId: string): void;
}

export class ScriptProcessor<T, E = {}> {
    private scripts: Script<T>[];
    private scriptMap?: Map<Script<T>, ExecutionStep[]>;
    private external: (E|{}) & typeof DEFAULT_EXTERNALS;
    private convertorSet: ConvertorSet;
    private refreshCleanups: Record<string, () => void> = {};

    constructor(scripts: Script<T>[], external = {}, convertorSet: ConvertorSet = getDefaultConvertors()) {
        this.scripts = scripts;
        this.convertorSet = convertorSet;
        this.external = {...DEFAULT_EXTERNALS, ...external};
    }

    clear() {
        Object.values(this.refreshCleanups).forEach(cleanup => {
            cleanup();
        });
        Object.keys(this.refreshCleanups).forEach(key => {
            delete this.refreshCleanups[key];
        });
    }

    private async fetchScripts(): Promise<Map<Script<T>, ExecutionStep[]>> {
        if (!this.scriptMap) {
            this.scriptMap = await convertScripts(this.scripts, this.external, this.convertorSet, {
                refreshSteps: this.refreshSteps.bind(this),
                stopRefresh: this.stopRefresh.bind(this),
            });
        }
        return this.scriptMap!;
    }

    private createRefreshCleanup(behavior: RefreshBehavior, context: Context) {
        const cleanupActions = context.cleanupActions;
        return behavior.cleanupAfterRefresh && cleanupActions ? () => {
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

    async runByName(name: string, parameters?: ExecutionParameters) {
        const context: Context = createContext();
        execute(await this.getSteps({ name }), parameters, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    async runByTags(tags: Tag[], parameters?: ExecutionParameters) {
        const context: Context = createContext();
        execute(await this.getSteps({ tags }), parameters, context);
        return () => context.cleanupActions?.forEach(action => action());
    }

    private async refreshWithFilter(filter: ScriptFilter, behavior: RefreshBehavior = {}) {
        return this.refreshSteps(await this.getSteps(filter), behavior);
    }

    private stopRefresh(processId: string) {
        this.refreshCleanups[processId]?.();
        delete this.refreshCleanups[processId];
    }
    
    private refreshSteps(steps: ExecutionStep[], behavior: RefreshBehavior = {}, processId?: string) {
        const context: Context = createContext();
        const parameters: ExecutionParameters = { ...behavior.parameters, time: 0, frame: 0 };
        const refreshCleanup = this.createRefreshCleanup(behavior, context);
        const frameRate = behavior.frameRate ?? 60;
        const frameMs = 1000 / frameRate;
        let lastFrameTime = Number.MIN_SAFE_INTEGER;
        let frame = 0;
        const loop = (time: number) => {
            if (time >= lastFrameTime + frameMs) {
                parameters.time = time;
                parameters.frame = frame;
                execute(steps, parameters, context);
                refreshCleanup();
                frame++;
                lastFrameTime = time;
            }
            animationFrameId = requestAnimationFrame(loop);
        };
        let animationFrameId = requestAnimationFrame(loop);
        const cleanup = () => {
            refreshCleanup();
            cancelAnimationFrame(animationFrameId);
        }
        if (processId?.length) {
            this.refreshCleanups[processId] = cleanup;
        }

        return cleanup;
    }
    
    refreshByName(name: string, behavior: RefreshBehavior = {}) {
        return this.refreshWithFilter({ name }, behavior);
    }

    refreshByTags(tags: string[], behavior: RefreshBehavior = {}) {
        return this.refreshWithFilter({ tags }, behavior);
    }
}