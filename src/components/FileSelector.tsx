
export type FileSelectorProps = {
    selectedFile?: string | null;
    files: string[];
    onChange: (taegetFile: string) => void
}
export default function FileSelector ({selectedFile, files, onChange}: FileSelectorProps) {
    return (
        <>
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
            onChange(e.target.value);
          }}>
            <option value="__NULL__" disabled={true}>--- select a file ---</option>
            {files.map(file => {
              return <option key={file} value={file}>{file}</option>
            })}
            
          </select>
        </>
    )
}