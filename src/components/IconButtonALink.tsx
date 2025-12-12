import Icon from "@mdi/react";
import { AnchorHTMLAttributes, ReactNode } from "react";

export type IconButtonAsLinkProps = {
    path: string;
    children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;
export function IconButtonAsLink ({path, children, ...props}: IconButtonAsLinkProps) {
    return (
        <a {...props} style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
        }}>
            <Icon path={path} size={1} />
            <div>
                {children}
            </div>
        </a>
    )
}