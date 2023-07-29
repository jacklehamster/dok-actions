import { DokAction } from "../actions/Action";
import { Script, filterScripts, } from "./Script";

describe('Script', () => {
    const scripts: Script<DokAction>[] = [
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
        {
            actions: [],
            tags: ["loop"],
        },
        {
            scripts: [
                {
                    name: "subscript"
                },
            ]
        }
    ];

    it('find by name', () => {
        expect(filterScripts(scripts, { name: "script1"})).toEqual([scripts[0]]);
        expect(filterScripts(scripts, { name: ["script1", "script3"] })).toEqual([scripts[0], scripts[2]]);
    });

    it('find by tags', () => {
        expect(filterScripts(scripts, { tags: ["loop"]})).toEqual([scripts[2], scripts[3]]);
        expect(filterScripts(scripts, { tags: [["level", 1]]})).toEqual([scripts[1]]);
        expect(filterScripts(scripts, { tags: ["level"]})).toEqual([scripts[1], scripts[2]]);
    });

    it('check empty filter', () => {
        expect(filterScripts(scripts, { name: "test" })).toEqual([]);
    });

    it('check empty filter', () => {
        expect(filterScripts(scripts, { name: "test" })).toEqual([]);
    });

    it('find by name with subscripts', () => {
        expect(filterScripts(scripts, { name: "subscript"})).toEqual([scripts[4].scripts?.[0]]);
    });
});
