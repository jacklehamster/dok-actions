import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_EXTERNALS, DokAction, ScriptProcessor } from 'dok-actions';
import { DokEditor, getObject } from "dok-editor";

export const App = () => {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("yaml");

    useEffect(() => {
        fetch("code/initial-code.yaml").then(response => response.text()).then(text => {
            setCode(text);
        });
    }, []);

    const processor = useRef<ScriptProcessor<DokAction>>();
    const outputer = useMemo(() => {
        let preDate = "";
        return {
            send: (params: any) => {
                setOutput(output => {
                    const dateLine = `====== ${new Date().toLocaleString()} =======\n`;
                    const result = output + (preDate !== dateLine ? dateLine : "") + params + "\n";
                    preDate = dateLine;
                    return result;
                });
            },
        };
    }, [setOutput]);

    const execute = useCallback(() => {
        processor.current?.clear();
        const obj = getObject(code, language);
        processor.current = new ScriptProcessor(obj.scripts, {
            ...DEFAULT_EXTERNALS,
            log: outputer.send,
        });
        processor.current.runByTags(["main"]);
    }, [code, language, outputer]);

    return <>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
            <div style={{ border: "1px solid black", width: "50%", height: "100%" }}>
                <div style={{ width: "100%" }}>
                    <div style={{ backgroundColor: "#bbffdd", width: "100%" }}>
                        <label htmlFor="log">Output</label>
                    </div>
                    <textarea id="log" readOnly style={{ width: "100%", height: 300, borderWidth: 0, color: "snow", backgroundColor: "black"  }} value={output}></textarea>
                </div>
                <button onClick={() => setOutput("")}>clear</button>
            </div>
            <div style={{ border: "1px solid black", width: "50%", height: "100%" }}>
                <button onClick={execute}>execute</button>
                <DokEditor code={code} onCodeChange={setCode} language={language} onLanguageChange={setLanguage} />
            </div>
        </div>
    </>;
};
