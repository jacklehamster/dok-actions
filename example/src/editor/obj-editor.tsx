import React, { useMemo } from "react";
import { Language, getObject } from "../language/lang-utils";
import { NodeRenderer } from "./node-renderer";
interface Props {
    language: Language;
    code: string;
}

export function ObjEditor({language, code}:Props) {
    const obj = useMemo(() => getObject(code, language), [code, language]);
    return <NodeRenderer obj={obj} />;
}