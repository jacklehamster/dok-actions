import { Script, getByName, getByTags } from "./Script";

describe('Script', () => {
    const scripts: Script[] = [
        {
            name: "script1",
            actions: [],
        },
        {
            name: "script2",
            actions: [],
            tags: ["game", ["level", 1]],
        },
        {
            name: "script3",
            actions: [],
            tags: ["game", "loop", ["level", 2]]
        },
    ];

    it('find by name', () => {
        expect(getByName(scripts, "script1")).toEqual([scripts[0]]);
        expect(getByName(scripts, ["script1", "script3"])).toEqual([scripts[0], scripts[2]]);
    });

    it('find by tags', () => {
        expect(getByTags(scripts, ["loop"])).toEqual([scripts[2]]);
        expect(getByTags(scripts, [["level", 1]])).toEqual([scripts[1]]);
        expect(getByTags(scripts, ["level"])).toEqual([scripts[1], scripts[2]]);
    });
});