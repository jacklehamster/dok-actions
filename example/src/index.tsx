import { Editor, useMonaco } from '@monaco-editor/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as ReactDOMClient from 'react-dom';
import { parse, stringify } from 'yaml'
import { DEFAULT_EXTERNALS, DokAction, ScriptProcessor } from 'dok-actions';


const App = () => {
    const [language, setLanguage] = useState<'yaml'|'json'|string>("yaml");
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const monaco = useMonaco();

    const getObject = useCallback((code: string, lang: 'yaml'|'json'|string) => {
        return lang === 'yaml' ? parse(code) : lang === 'json' ? JSON.parse(code): {};
    }, []);
    console.log(monaco, code);
    useEffect(() => {
        fetch("code/initial-code.yaml").then(async response => {
            setCode(await response.text());
        });
    }, []);

    const processor = useRef<ScriptProcessor<DokAction>>();

    const execute = useCallback(() => {
        processor.current?.clear();
        const obj = getObject(code, language);
        processor.current = new ScriptProcessor(obj.scripts, {
            ...DEFAULT_EXTERNALS,
            log: (params: any) => setOutput(output => output + params + "\n"),
        });
        processor.current.runByTags(["main"]);
        (window as any).processor = processor.current;
    }, [code, getObject, language]);

    return <>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
            <div style={{ border: "1px solid black", width: "50%", height: "100%" }}>
                <div>
                    <label htmlFor="log">Logs</label>
                    <textarea id="log" readOnly style={{ width: "100%", height: 300, borderWidth: 0 }} value={output}></textarea>
                </div>
                <button onClick={() => setOutput("")}>clear</button>
            </div>
            <div style={{ border: "1px solid black", width: "50%", height: "100%" }}>
                <select onChange={({ target }) => {
                    setLanguage(lang => {
                        const obj = getObject(code, lang);
                        const newLang = target.value;
                        if (newLang === 'yaml') {
                            setCode(stringify(obj));
                        } else if(newLang === 'json') {
                            setCode(JSON.stringify(obj, null, "  ") + "\n")
                        }
                        return newLang;
                    });
                }}>
                    <option value="yaml">yaml</option>
                    <option value="json">json</option>
                </select>
                <button onClick={execute}>execute</button>
                <Editor height="80vh" defaultLanguage={language} value={code}
                    onChange={value => {
                        if (value && code !== value) {
                            setCode(value);
                        }
                }}></Editor>
            </div>
        </div>
    </>;
};


const root = document.getElementById('root');
root!.style.height = "100vh";
root!.style.width = "100vw";
document.body.style.margin = "0px";

ReactDOMClient.render(<App></App>, root);
