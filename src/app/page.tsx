import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1><code>@ooxml-tools/toolbox</code></h1>
      <p>
        A toolbox app for Office Open XML files in the browser
      </p>
      <input type="file" />
      <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
        <pre style={{border: "solid 1px black"}}>
          File list...
        </pre>
        <pre style={{border: "solid 1px black"}}>
          Preview
        </pre>
      </div>
    </main>
  );
}
