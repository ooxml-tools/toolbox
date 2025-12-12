"use client"
import { useEffect, useState } from "react";
import { OfficeOpenXml } from "@ooxml-tools/file";
import ImageViewer from "./ImageViewer";
import UnknownState from "./UnknownState";
import EmptyState from "./EmptyState";
import dynamic from "next/dynamic";
import { editor } from "monaco-editor";
const MonacoEditor = dynamic(() => import('./MonacoEditor'), {
    ssr: false,
  })

type FileViewerProps = {
    file?: OfficeOpenXml
    selectedFile?: string | null;
    onChange?: () => void;
}
export default function FileViewer ({file, selectedFile, onChange}: FileViewerProps) {
    const [contents, setContents] = useState<ArrayBuffer | null>(null);
    useEffect(() => {
      if (file && selectedFile) {
        (async () => {
            const buffer = await file.readFile(selectedFile, "arraybuffer");
            setContents(buffer)
        })();
      }
      return () => {
        setContents(null);
      }
    }, [file, selectedFile])

    const onChangeLocal = (instance: editor.IStandaloneCodeEditor) => {
        if (file && selectedFile) {
            file?.writeFile(selectedFile, instance.getValue());
            onChange?.();
        }
    }

    if (contents && selectedFile?.match(/.(xml|rels)/)) {
        return <MonacoEditor data={contents} onChange={onChangeLocal} />
    }
    else if (contents && selectedFile?.match(/.(png|jpeg|jpg)/)) {
        return <ImageViewer data={contents} />
    }
    else {
        return <div style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            background: "#eee"
        }}>
            {contents && <UnknownState />}
            {!contents && <EmptyState />}
        </div>
    }
}