export declare const DEFAULT_EXTERNALS: {
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    setTimeout: typeof setTimeout;
    clearTimeout: typeof clearTimeout;
    fetch: typeof fetch;
};
