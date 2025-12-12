'use client'
import {editor} from 'monaco-editor';
import { useEffect, useMemo, useRef, useState } from 'react';
import xmlFormat from 'xml-formatter';

type MonacoEditorProps = {
    data?: ArrayBuffer;
    readOnly?: boolean;
    onChange?: (editor: editor.IStandaloneCodeEditor) => void;
}
export default function MonacoEditor ({data, readOnly, onChange}: MonacoEditorProps) {
    const ref = useRef(null);
    const [instance, setInstance] = useState<editor.IStandaloneCodeEditor | null>(null);

    const xml = useMemo(() => {
        const decoder = new TextDecoder();
        try {
            return data ? xmlFormat(decoder.decode(data)) : ""
        } catch (err) {
            console.log(err);
            return ""
        }
    }, [data])

    useEffect(()=> {
        if (ref.current) {
            const monInstance = editor.create(ref.current, {
                value: "",
                language: 'xml',
                readOnly,
                automaticLayout: true,
            });
            setInstance(monInstance)

            return () => {
                setInstance(null)
                monInstance.dispose();
            }
        }
    }, [ref])

    useEffect(() => {
        if (instance && onChange) {
            const fn = (event: editor.IModelContentChangedEvent) => {
                onChange(instance);
            }
            const disposable = instance?.getModel()?.onDidChangeContent(fn);
            return () => {
                disposable?.dispose();
            }
        }
    }, [instance])

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