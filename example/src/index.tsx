import { Editor, useMonaco } from '@monaco-editor/react';
import React, { useState } from 'react';
import * as ReactDOMClient from 'react-dom';
import { parse, stringify } from 'yaml'

const App = () => {
    const [language, setLanguage] = useState<'yaml'|'json'|string>("yaml");
    const [code, setCode] = useState("");
    const monaco = useMonaco();
    console.log(monaco, code);

    return <>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
            <div style={{ border: "1px solid black", width: "50%", height: "100%" }}></div>
            <div style={{ border: "1px solid black", width: "50%", height: "100%" }}>
                <button>save</button>
                <select onChange={({ target }) => {
                    setLanguage(lang => {
                        const obj = lang === 'yaml' ? 
                            parse(code) :
                            lang === 'json' ?
                            JSON.parse(code)
                            : {};
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
