import { useEffect, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import { OfficeOpenXml } from "@ooxml-tools/file";
import ImageViewer from "./ImageViewer";
import Icon from "@mdi/react";
import { mdiAlertCircleOutline } from "@mdi/js";

type FileViewerProps = {
    file?: OfficeOpenXml
    selectedFile?: string | null;
}
export default function FileViewer ({file, selectedFile}: FileViewerProps) {
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

    if (contents && selectedFile?.match(/.(xml|rels)/)) {
        return <MonacoEditor data={contents} />
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
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
            }}>
                <Icon path={mdiAlertCircleOutline} size={2} color={"#aaa"} />
                Can&apos;t display file
            </div>
        </div>
    }
}