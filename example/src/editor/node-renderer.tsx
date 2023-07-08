import React, { useMemo } from "react";

interface Props {
    obj: any;
}

export function NodeRenderer({obj}: Props) {
    const entries = useMemo(() => Object.entries(obj), [obj]);
    return <>
        {entries.map(([key, value]) => {
            return <div key={key} style={{ marginLeft: 5, backgroundColor: Array.isArray(obj) ? "lemonchiffon" : "beige"}}>
                <div style={{ border: Array.isArray(obj) ? 1 : 0, marginTop: 5, borderStyle: "solid", padding: 5, display: typeof(value) === "object" ? "block" : "flex" }}>
                    {!Array.isArray(obj) && <div style={{ backgroundColor: "yellow", borderRadius: 10, paddingLeft: 10, paddingRight: 10, width: "fit-content", height: "fit-content" }}>{key}: </div>}
                    <div>
                        {typeof(value) === "object" ? <NodeRenderer obj={value} /> : <>{value}</>}
                    </div>
                </div>
            </div>;
        })}
    </>;
}