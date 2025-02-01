import * as monaco from 'monaco-editor';
import { useEffect, useMemo, useRef, useState } from 'react';
import xmlFormat from 'xml-formatter';

type MonacoEditorProps = {
    data?: ArrayBuffer
}
export default function MonacoEditor ({data}: MonacoEditorProps) {
    const ref = useRef(null);
    const [instance, setInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

    const xml = useMemo(() => {
        const decoder = new TextDecoder()
        const foo = decoder.decode(data);
        try {
            return data ? xmlFormat(foo) : ""
        } catch (err) {
            console.log(err);
            return ""
        }
    }, [data])

    useEffect(()=> {
        if (ref.current) {
            const monInstance = monaco.editor.create(ref.current, {
                value: "",
                language: 'xml',
                readOnly: true,
                automaticLayout: true,
            }, {
                // openerService: {
                //     open: function (resource, options) {
                //         console.log("open", {resource, options})
                //         // do something here, resource will contain the Uri
                //     }
                // }
            });
            setInstance(monInstance)

            return () => {
                setInstance(null)
                monInstance.dispose();
            }
        }
    }, [ref])

    useEffect(() => {
        if (instance && xml) {
            instance.setValue(xml);
        }
    }, [instance, xml])

    return <div style={{flex: 1, overflow: "hidden", position: "relative"}}>
        <div ref={ref} style={{height: "100%", width: "100%"}} />
        {!xml && <div style={{
            height: "100%",
            width: "100%",
            display: "flex",
            background: "#eee",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 9999,
        }}>
            No file selected
        </div>}
    </div>
}