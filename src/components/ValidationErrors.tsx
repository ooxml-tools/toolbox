import { ValidationResult } from "@ooxml-tools/validate";

export type ValidationErrorsProps = {
    errors: ValidationResult[]
}
export default function ValidationErrors ({errors}: ValidationErrorsProps) {
    return (
        <div>
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
    )
}