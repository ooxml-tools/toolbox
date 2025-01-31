"use client"
import JSZip from "jszip";
import styles from "./page.module.css";
import {open, formatFromFilename, OfficeOpenXml} from "@ooxml-tools/file"
import validate, { ValidationResult } from "@ooxml-tools/validate"
import { ChangeEvent, useEffect, useId, useMemo, useState } from "react";
import Icon from '@mdi/react';
import { mdiLoading, mdiUpload } from '@mdi/js';
import FileViewer from "./FileViewer";

type UploadButtonProps = {children: React.ReactNode, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}
function UploadButton ({onChange, children, ...rest}: UploadButtonProps) {
  const forId = useId();
  return <div>
    <label htmlFor={forId} style={{display: "flex", gap: 6, alignItems: "center"}}>
      {children}
    </label>
    <input {...rest} id={forId} type="file" style={{display: "none"}} onChange={onChange} />
  </div>
}

export default function Home() {
  const [file, setFile] = useState<OfficeOpenXml | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [state, setState] = useState<"IDLE" | "PROCESSING">("IDLE")
  const [errors, setErrors] = useState<ValidationResult[]>([])
  
  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setState("PROCESSING")
    try {
      const file = e.target.files?.[0];
      if (!file) {
        throw new Error("No files provided");
      } 

      const p = new Promise<ArrayBuffer>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as ArrayBuffer);
        fr.onerror = reject;
        fr.readAsArrayBuffer(file);
      })
      const buffer = await p;
      const arr = new Uint8Array(buffer);

      const zip = new JSZip();
      await zip.loadAsync(buffer);
      const ooxmlFile = open(formatFromFilename(file.name), zip);
      if (ooxmlFile) {
        setFile(ooxmlFile)
      }

      const newErrors = await validate(arr, "docx");
      setErrors(newErrors);
    } catch (err: any) {
      console.log(err);
    } finally {
      setState("IDLE")
    }
  }

  const files = useMemo(() => {
    if (file) {
      return file.list().filter(filepath => {
        return !filepath.endsWith("/")
      });
    }
    return [];
  }, [file]);

  return (
    <div style={{height: "100%", position: "relative", display: "flex", flexDirection: "column"}}>
      <div style={{borderBottom: "solid 1px #ccc",}}>
      <header style={{borderBottom: "solid 1px #eee", display: "flex", padding: "8px 12px", overflow: "hidden"}}>
        <h1 style={{margin: 0, display: "flex"}}>
          <img
            alt="@ooxml-tools/toolbox"
            src="https://ooxml-tools.github.io/design/images/toolbox-light.png"
            height="38"
          />
        </h1>
        <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end"}}>

          <input type="file" onChange={onChangeFile} />
        </div>
      </header>
      {state === "IDLE" && file && <div style={{
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <label>
            Current file
          </label>
          <select style={{
            flex: 1,
            display: "block",
            padding: "3px 2px",
            border: "solid 1px #ddd",
            borderRadius: 4,
          }}
          value={selectedFile ?? "__NULL__"}
          onChange={(e) => {
            setSelectedFile(e.target.value);
          }}>
            <option value="__NULL__" disabled={true}>--- select a file ---</option>
            {files.map(file => {
              return <option key={file} value={file}>{file}</option>
            })}
            
          </select>
        </div>}
      </div>
    <main className={styles.main} style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {!file && state === "IDLE" &&
        <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#eee"}}>
          <div style={{paddingBottom: "4em"}}>
            <UploadButton onChange={onChangeFile}>
              <Icon path={mdiUpload} size={1} />
              Custom Upload
            </UploadButton>
          </div>
        </div>
      }
      {state === "PROCESSING" && 
      <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#eee"}}>
        <p style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <Icon path={mdiLoading} size={1} spin={0.7} />
          Loading
        </p>
      </div>}
      {file && state === "IDLE" && 
      <>
        <div style={{display: "grid", gridTemplateRows: "50% 50%", flex: 1, height: "100%"}}>
          <FileViewer file={file} selectedFile={selectedFile} />
          <div style={{borderTop: "solid 2px #ddd", overflowY: "scroll"}}>
            {errors.length < 1 && <p>No errors...</p>}
            {errors.length > 0 && <div>
              {errors.map((error, errorIdx) => {
                return <div key={errorIdx} style={{borderBottom: "solid 1px #ddd", padding: 8, wordBreak: "break-word"}}>
                  <div>
                    <span style={{color: "blue"}}>{error.path.partUri}</span><span style={{color: "red"}}>{error.path.xpath}</span>
                  </div>
                  <div>{error.id}: {error.description}</div>
                </div>;
              })}
            </div>}
          </div>
        </div>
      </>}
    </main>
    </div>
  );
}
