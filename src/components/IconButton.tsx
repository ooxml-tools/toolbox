import Icon from "@mdi/react";
import { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonProps = {
    path: string;
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export function IconButton ({path, children, ...props}: IconButtonProps) {
    return (
        <button style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            cursor: props.disabled ? "not-allowed" : "pointer",
            background: "none",
            fontFamily: "inherit",
            fontSize: "inherit",
            border: "none",
            padding: 0,
            color: props.disabled ? "gray" : "black"
        }} {...props}>
            <Icon path={path} size={1} />
            <div>
                {children}
            </div>
        </button>
    )
}