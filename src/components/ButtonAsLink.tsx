import { ButtonHTMLAttributes, ReactNode } from "react";

export function ButtonAsLink ({children, ...props}: {children: ReactNode} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} style={{display: "inline-block", background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit", textDecoration: "underline", cursor: "pointer", padding: 0}}>
    {children}
  </button>
}