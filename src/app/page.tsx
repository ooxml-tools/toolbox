"use client"
import JSZip from "jszip";
import {open, formatFromFilename, OfficeOpenXml} from "@ooxml-tools/file"
import { ValidationResult } from "@ooxml-tools/validate"
import { useMemo, useState } from "react";
import Icon from '@mdi/react';
import { mdiUpload } from '@mdi/js';
import FileViewer from "../components/FileViewer";
import UploadButton from "@/components/UploadButton";
import LoadingState from "@/components/LoadingState";
import ValidationErrors from "@/components/ValidationErrors";
import Layout from "@/components/Layout";
import { wrap } from "comlink";
import { ValidateFn } from "./validate-worker";

const validate = wrap<ValidateFn>(
  new Worker(new URL('./validate-worker', import.meta.url), {
    type: 'module'
  })
);

export default function Home() {
  const [file, setFile] = useState<OfficeOpenXml | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [state, setState] = useState<"IDLE" | "PROCESSING">("IDLE")
  const [errors, setErrors] = useState<ValidationResult[]>([])
  
  const onChangeFile = async (file: File) => {
    setState("PROCESSING")
    try {
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
    <Layout
      files={files}
      onChangeSelected={setSelectedFile}
      onChangeFile={onChangeFile}>
      {!file && state === "IDLE" &&
        <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#eee"}}>
          <div style={{paddingBottom: "4em"}}>
            <UploadButton onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChangeFile(file)
              }
            }}>
              <Icon path={mdiUpload} size={1} />
              Custom Upload
            </UploadButton>
          </div>
        </div>
      }
      {state === "PROCESSING" && 
      <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#eee"}}>
        <LoadingState />
      </div>}
      {file && state === "IDLE" && <div style={{display: "grid", gridTemplateRows: "50% 50%", flex: 1, height: "100%"}}>
        <FileViewer file={file} selectedFile={selectedFile} />
        <div style={{borderTop: "solid 2px #ddd", overflowY: "scroll"}}>
          <ValidationErrors errors={errors} />
        </div>
      </div>}
    </Layout>
  );
}
