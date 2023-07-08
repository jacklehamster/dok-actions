import { Editor } from '@monaco-editor/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { stringify } from 'yaml'
import { DEFAULT_EXTERNALS, DokAction, ScriptProcessor } from 'dok-actions';
import { Language, getObject } from './language/lang-utils';
import { ObjEditor } from './editor/obj-editor';

export const App = () => {
    const [language, setLanguage] = useState<Language>("yaml");
    const [editor, setEditor] = useState(false);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");

    useEffect(() => {
        fetch("code/initial-code.yaml").then(response => response.text()).then(text => {
            setCode(text);
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
    }, [code, language]);

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
                    const option = target.value;
                    if (option === "editor") {
                        setEditor(true);
                    } else {
                        setEditor(false);
                        setLanguage(lang => {
                            const obj = getObject(code, lang);
                            const newLang = option;
                            if (newLang === 'yaml') {
                                setCode(stringify(obj));
                            } else if(newLang === 'json') {
                                setCode(JSON.stringify(obj, null, "  ") + "\n")
                            }
                            return newLang;
                        });    
                    }
                }}>
                    <option value="yaml">yaml</option>
                    <option value="json">json</option>
                    <option value="editor">editor</option>
                </select>
                <button onClick={execute}>execute</button>
                {!editor && <Editor height="80vh" defaultLanguage={language} value={code}
                    onChange={value => {
                        if (value && code !== value) {
                            setCode(value);
                        }
                }} />}
                {editor && <ObjEditor code={code} language={language} />}
            </div>
        </div>
    </>;
};
