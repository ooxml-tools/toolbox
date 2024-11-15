"use client"
import styles from "./page.module.css";
import validate, { ValidationResult } from "@ooxml-tools/validate"
import { ChangeEvent, useState } from "react";

export default function Home() {
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
      const newErrors = await validate(arr, "docx");
      setErrors(newErrors);
    } catch (err: any) {
      console.log(err);
    } finally {
      setState("IDLE")
    }
  }
  
  return (
    <main className={styles.main}>
      <h1><code>@ooxml-tools/toolbox</code></h1>
      <p>
        A toolbox app for Office Open XML files in the browser
      </p>
      <h2>Validation</h2>
      <p>
        Validate a file
      </p>
      <input type="file" onChange={onChangeFile} />
      <h3 style={{marginBottom: 0}}>Errors</h3>
      {state === "PROCESSING" && <p>
        Loading...
      </p>}
      {state === "IDLE" && 
      <>
        {errors.length < 1 && <p>No errors...</p>}
        {errors.length > 0 && <div style={{
          border: "solid 1px #ddd",
          borderBottom: "none",
        }}>
          {errors.map((error, errorIdx) => {
            return <div key={errorIdx} style={{borderBottom: "solid 1px #ddd", padding: 8}}>
              <div>
                <span style={{color: "blue"}}>{error.path.partUri}</span><span style={{color: "red"}}>{error.path.xpath}</span>
              </div>
              <div>{error.id}: {error.description}</div>
            </div>;
          })}
        </div>}
      </>}
    </main>
  );
}
