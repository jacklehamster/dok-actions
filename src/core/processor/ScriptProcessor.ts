import { Context, createContext } from "../context/Context";
import { ConvertorSet } from "../convertor/Convertor";
import { DEFAULT_REFRESH_FRAME_RATE } from "../convertor/actions/refresh-convertor";
import { getDefaultConvertors } from "../convertor/default-convertors";
import { DEFAULT_EXTERNALS } from "../convertor/default-externals";
import { convertScripts } from "../convertor/utils/script-utils";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag, filterScripts } from "../scripts/Script";
import { v4 as uuidv4 } from 'uuid';

export interface RefreshBehavior {
    frameRate?: number;
    cleanupAfterRefresh?: boolean;
    parameters?: ExecutionParameters;
}

export interface ScriptProcessorHelper {
    refreshSteps(steps: ExecutionStep[], behavior?: RefreshBehavior, processId?: string): { cleanup: () => void; processId: string };
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

    updateScripts(scripts: Script<T>[]) {
        this.clear();
        this.scripts = scripts;
        this.scriptMap = undefined;
    }

    clear() {
        Object.values(this.refreshCleanups).forEach(cleanup => cleanup());
        Object.keys(this.refreshCleanups).forEach(key => delete this.refreshCleanups[key]);
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
        return behavior.cleanupAfterRefresh ? () => context.cleanup() : () => {};
    }

    async getSteps(filter: ScriptFilter) {
        const scriptMap = await this.fetchScripts();
        const scripts = filterScripts(this.scripts, filter);
        const steps: ExecutionStep[] = [];
        scripts.forEach(script => scriptMap.get(script)?.forEach(step => steps.push(step)));
        return steps;
    }

    async runByName(name: string, parameters: ExecutionParameters = {}) {
        const context: Context = createContext();
        execute(await this.getSteps({ name }), {
            ...parameters,
            time: undefined,
            index: undefined,
        }, context);
        return () => context.clear();
    }

    async runByTags(tags: Tag[], parameters: ExecutionParameters = {}) {
        const context: Context = createContext();
        execute(await this.getSteps({ tags }), {
            ...parameters,
            time: undefined,
            index: undefined,
        }, context);
        return () => context.clear();
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
        const frameRate = behavior.frameRate ?? DEFAULT_REFRESH_FRAME_RATE;
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
        const actualProcessId = processId ?? uuidv4();
        //  cleanup previous process if it exists.
        this.refreshCleanups[actualProcessId]?.();

        this.refreshCleanups[actualProcessId] = cleanup;

        return { processId: actualProcessId, cleanup };
    }
    
    refreshByName(name: string, behavior: RefreshBehavior = {}) {
        return this.refreshWithFilter({ name }, behavior);
    }

    refreshByTags(tags: string[], behavior: RefreshBehavior = {}) {
        return this.refreshWithFilter({ tags }, behavior);
    }
}