import { mdiArrowCollapseDown, mdiArrowCollapseUp } from "@mdi/js";
import Icon from "@mdi/react";
import { ValidationResult } from "@ooxml-tools/validate";
import { useState } from "react";

export type ValidationErrorsProps = {
    errors: ValidationResult[]
}
export default function ValidationErrors ({errors}: ValidationErrorsProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const hasErrors = errors.length > 0;

    return (
        <div style={{display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", height: "100%"}}>
            <div style={{borderBottom: "solid 1px #ddd", padding: "8px 12px", display: "flex", alignItems: "center"}}>
                <h2 style={{flex: 1, fontSize: "1em", fontWeight: "normal", margin: 0}}>
                    {hasErrors && <>{errors.length} Errors</>}
                    {!hasErrors && <>No errors in file</>}
                </h2>
                <div>
                    {hasErrors &&
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            style={{
                                background: "none",
                                border: "none",
                                padding: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            {isCollapsed ? "Expand" : "Collapse"}
                            <Icon path={isCollapsed ? mdiArrowCollapseUp : mdiArrowCollapseDown} size={0.7} />
                        </button>
                    }
                </div>
            </div>
            <div style={{overflowY: "scroll", flex: "1 1", display: isCollapsed ? "none" : ""}}>
                {hasErrors && <div>
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
    )
}