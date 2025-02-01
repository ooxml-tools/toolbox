"use client"

import { useId } from "react";

export type UploadButtonProps = {children: React.ReactNode, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}
export default function UploadButton ({onChange, children, ...rest}: UploadButtonProps) {
  const forId = useId();
  return <div>
    <label htmlFor={forId} style={{display: "flex", gap: 6, alignItems: "center"}}>
      {children}
    </label>
    <input {...rest} id={forId} type="file" style={{display: "none"}} onChange={onChange} />
  </div>
}