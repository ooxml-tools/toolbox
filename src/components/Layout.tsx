import React from "react";
import FileSelector from "./FileSelector";
import UploadButton from "./UploadButton";
import { mdiGithub, mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";

export type LayoutProps = {
    selectedFile?: string | null;
    files: string[];
    onChangeSelected: (newSelectedFile: string) => void;
    onChangeFile: (newFile: File) => void;
    children: React.ReactNode
}
export default function Layout({ selectedFile, files, onChangeSelected, onChangeFile, children }: LayoutProps) {
    return (
        <div style={{ height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
            <div style={{ borderBottom: "solid 1px #ccc", }}>
                <header style={{ borderBottom: "solid 1px #eee", display: "flex", padding: "8px 12px", overflow: "hidden" }}>
                    <h1 style={{ margin: 0, display: "flex" }}>
                        <img
                            alt="@ooxml-tools/toolbox"
                            src="https://ooxml-tools.github.io/design/images/toolbox-light.png"
                            height="38"
                        />
                    </h1>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16 }}>
                        <a href="https://github.com/ooxml-tools/toolbox" style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            textDecoration: "none",
                            color: "inherit",
                            cursor: "pointer",
                        }}>
                            <Icon path={mdiGithub} size={1} />
                            Github
                        </a>
                        <UploadButton onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                onChangeFile(file)
                            }
                        }}>
                            <Icon path={mdiUpload} size={1} />
                            Upload file
                        </UploadButton>
                    </div>
                </header>
                <div style={{
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}>
                    <FileSelector
                        selectedFile={selectedFile}
                        files={files}
                        onChange={onChangeSelected}
                    />
                </div>
            </div>
            <main style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
            }}>
                {children}
            </main>
        </div>
    );
}