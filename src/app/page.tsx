"use client"
import JSZip from "jszip";
import styles from "./page.module.css";
import {open, formatFromFilename, OfficeOpenXml} from "@ooxml-tools/file"
import validate, { ValidationResult } from "@ooxml-tools/validate"
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import xmlFormat from 'xml-formatter';

type FileContentProps = {
  file: any;
  selected: string | null;
}
function FileContent ({selected, file}: FileContentProps) {
  const [type, setType] = useState(null);
  const [content, setContent] = useState("");
  useEffect(() => {
    if (file && selected) {
      if (selected.endsWith(".xml")) {
        (async () => {
          setContent(await file.readFile(selected, "string"))
        })();
      }
    }
  }, [selected, file])

  if (!selected) {
    return <div>...</div>
  }

  return <div>
    <textarea defaultValue={content}/>
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
  
  const [contents, setContents] = useState("");
  useEffect(() => {
    if (file && selectedFile) {
      (async () => {
        setContents(
          xmlFormat(await file.readFile(selectedFile, "string"))
        )
      })();
    }
  }, [file, selectedFile])

  return (
    <div style={{height: "100%", position: "relative", display: "flex", flexDirection: "column"}}>
      <header style={{borderBottom: "solid 1px #eee", display: "flex", padding: "8px 12px"}}>
        <h1 style={{margin: 0, display: "flex"}}>
          <img
            alt="@ooxml-tools/toolbox"
            src="https://ooxml-tools.github.io/design/images/toolbox-light.png"
            height="56"
          />
        </h1>
        <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end"}}>

          <input type="file" onChange={onChangeFile} />
        </div>
      </header>
    <main className={styles.main} style={{flex: 1, display: "flex", flexDirection: "column"}}>
      {!file &&
        <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <div style={{paddingBottom: "4em"}}>
            <p>
              Open a new file
            </p>
            <input type="file" onChange={onChangeFile} />
          </div>
        </div>
      }
      {state === "PROCESSING" && <p>
        Loading...
      </p>}
      {file && state === "IDLE" && 
      <>
        <div style={{
          padding: "8px 12px",
          borderBottom: "solid 1px #ccc",
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
        </div>
        <div style={{display: "grid", gridTemplateRows: "50% 50%", flex: 1, overflowY: "auto"}}>
          <MonacoEditor data={contents} />
          <div style={{borderTop: "solid 2px #ddd"}}>
            {errors.length < 1 && <p>No errors...</p>}
            {errors.length > 0 && <div>
              {errors.map((error, errorIdx) => {
                return <div key={errorIdx} style={{borderBottom: "solid 1px #ddd", padding: 8}}>
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
