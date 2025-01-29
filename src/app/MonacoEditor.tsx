import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

type MonacoEditorProps = {
    data?: string
}
export default function MonacoEditor ({data}: MonacoEditorProps) {
    const ref = useRef(null);
    const [instance, setInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

    useEffect(()=> {
        if (ref.current) {
            const monInstance = monaco.editor.create(ref.current, {
                value: data,
                language: 'xml',
                readOnly: true,
            });
            setInstance(monInstance)

            return () => {
                setInstance(null)
                monInstance.dispose();
            }
        }
    }, [ref])

    useEffect(() => {
        if (instance && data) {
            instance.setValue(data);
        }
    }, [instance, data])

    return <div style={{flex: 1, overflow: "hidden", position: "relative"}}>
        <div ref={ref} style={{height: "100%"}} />
        {!data && <div style={{
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