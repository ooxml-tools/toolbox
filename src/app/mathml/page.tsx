'use client'
import JSZip from "jszip";
// Import the needed TeX packages
import "@mathjax/src/js/input/tex/base/BaseConfiguration.js";
import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js";
import "@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js";
import "@mathjax/src/js/input/tex/noundefined/NoUndefinedConfiguration.js";

//  Load the modules needed for MathJax
import { mml2omml } from "mathml2omml";
import { mathjax } from "@mathjax/src/js/mathjax.js";
import { TeX } from "@mathjax/src/js/input/tex.js";
import { liteAdaptor } from "@mathjax/src/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "@mathjax/src/js/handlers/html.js";
import { SerializedMmlVisitor } from "@mathjax/src/js/core/MmlTree/SerializedMmlVisitor.js";
import { STATE } from "@mathjax/src/js/core/MathItem.js";

import { docxBlankFiles, getMimeType, OfficeOpenXml } from "@ooxml-tools/file";
import { useId, useRef } from "react";

function texToMathML(math: string) {
  const adaptor = liteAdaptor({});
  RegisterHTMLHandler(adaptor);

  const tex = new TeX({
    packages: ["base", "ams", "newcommand", "noundefined"],
  });

  const html = mathjax.document("", {
    InputJax: tex,
  });

  const mml = html.convert(math, {
    display: true,
    end: STATE.CONVERT, // stop after conversion to MathML
  });

  const visitor = new SerializedMmlVisitor();
  return visitor.visitTree(mml);
}

function mathMlToOmml(text: string) {
  return mml2omml(
    text,
    { disableDecode: true },
  )
}

const blankDoc = (content: string) => `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:oel="http://schemas.microsoft.com/office/2019/extlst" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh wp14">
    <w:body>
      ${content}
    </w:body>
</w:document>
`.trim()

async function downloadWithContent (content: string) {
      const zip = new JSZip();
      const file = new OfficeOpenXml("docx", zip);
      file.writeFiles(docxBlankFiles)
      file.writeFile("word/document.xml", blankDoc(content));
              const buffer = await file.pack("arraybuffer");
      const blob = new Blob([new Uint8Array(buffer)], {
        type: getMimeType(file.type),
      })
      const url = URL.createObjectURL(blob)
      download(url, `download.${file.type}`)
}

function download(url: string, filename: string) {
  const aEl = document.createElement('a')
  aEl.setAttribute('href', url)
  aEl.setAttribute('download', filename)
  aEl.click()
}

const INITIAL_MATHML = `
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" class="tml-display" style="display:block math;">
  <mrow>
    <msub>
      <mo movablelimits="false">∮</mo>
      <mi>C</mi>
    </msub>
    <mover>
      <mi>B</mi>
      <mo stretchy="false" class="tml-vec chr-med wbk-med-vec">→</mo>
    </mover>
    <mo>∘</mo>
    <mrow>
      <mi mathvariant="normal">d</mi>
      <mspace></mspace>
    </mrow>
    <mover>
      <mi>l</mi>
      <mo stretchy="false" class="tml-vec chr-med wbk-med-vec">→</mo>
    </mover>
    <mo>=</mo>
    <msub>
      <mi>μ</mi>
      <mn>0</mn>
    </msub>
    <mrow>
      <mo fence="true" form="prefix" stretchy="true">(</mo>
      <msub>
        <mi>I</mi>
        <mtext>enc</mtext>
      </msub>
      <mo>+</mo>
      <msub>
        <mi>ε</mi>
        <mn>0</mn>
      </msub>
      <mfrac>
        <mrow>
          <mi mathvariant="normal">d</mi>
          <mspace></mspace>
        </mrow>
        <mrow>
          <mrow>
            <mi mathvariant="normal">d</mi>
            <mspace></mspace>
          </mrow>
          <mi>t</mi>
        </mrow>
      </mfrac>
      <msub>
        <mo movablelimits="false">∫</mo>
        <mi>S</mi>
      </msub>
      <mrow>
        <mover>
          <mi>E</mi>
          <mo stretchy="false" class="tml-vec chr-med wbk-med-vec">→</mo>
        </mover>
        <mo>∘</mo>
        <mover>
          <mi>n</mi>
          <mo stretchy="false" class="wbk-acc" style="math-depth:0;">^</mo>
        </mover>
      </mrow>
      <mspace width="0.2778em"></mspace>
      <mrow>
        <mi mathvariant="normal">d</mi>
        <mspace></mspace>
      </mrow>
      <mi>a</mi>
      <mo fence="true" form="postfix" stretchy="true">)</mo>
    </mrow>
  </mrow>
</math>
`.trim();

const INITIAL_TEX = `
\\def\\d{\\mathrm{d}}

\\oint_C \\vec{B}\\circ \\d\\vec{l} = \\mu_0 \\left( I_{\\text{enc}} + \\varepsilon_0 \\frac{\\d}{\\d t} \\int_S {\\vec{E} \\circ \\hat{n}}\\; \\d a \\right)
`.trim()

const TEX_EXAMPLES = [
  {
    name: "super simple",
    math: `2^7`.trim()
  },
  {
    name: "simple",
    math: `
\\def\\d{\\mathrm{d}}

\\oint_C \\vec{B}\\circ \\d\\vec{l} = \\mu_0 \\left( I_{\\text{enc}} + \\varepsilon_0 \\frac{\\d}{\\d t} \\int_S {\\vec{E} \\circ \\hat{n}}\\; \\d a \\right)
    `.trim()
  },
  {
    // Generated from chatgpt
    name: "complex",
    math: `
\\begin{aligned}
\\mathcal{F}(x)
&=
\\underbrace{
\\sum_{n=1}^{\\infty}
\\frac{\\alpha_n x^n}{\\sqrt[n]{1+\\beta_n}}
}_{\\text{infinite series}}
\\;+\\;
\\underbrace{
\\int_{0}^{\\pi}
\\frac{\\sin^2 \\theta}{1+\\cos \\theta}\\,d\\theta
}_{\\text{definite integral}}
\\;+\\;
\\underbrace{
\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}
}_{\\text{limit / derivative}}
\\\\[1em]
&\\quad
+\\;
\\left(
\\begin{array}{cc}
a_{11} & a_{12} \\\\
a_{21} & a_{22}
\\end{array}
\\right)
\\binom{u}{v}
\\;+\\;
\\left\\{
\\begin{array}{ll}
x^2, & x \\ge 0, \\\\
-x,  & x < 0
\\end{array}
\\right.
\\\\[1em]
&\\quad
+\\;
\\vec{v}\\cdot\\vec{w}
\\;+\\;
\\widehat{ABC}
\\;+\\;
\\overline{z}
\\;+\\;
\\widetilde{f\\ast g}
\\;+\\;
\\cancel{y}
\\\\[1em]
&\\quad
+\\;
\\prod_{k=1}^{m} (1+x_k)
\\;+\\;
\\bigsqcup_{i\\in I} A_i
\\;+\\;
\\bigcap_{j=1}^{r} B_j
\\;+\\;
\\bigoplus_{\\ell=1}^{N} V_\\ell
\\\\[1em]
&\\quad
+\\;
x_{i_1,\\dots,i_r}^{(m)}
\\overset{\\phi}{\\longrightarrow}
y^{\\prime\\prime}
\\iff
\\forall \\varepsilon > 0\\;\\exists \\delta > 0
\\\\[1em]
&\\quad
+\\;
\\overbrace{1+1+\\cdots+1}^{n\\text{ terms}}
\\;=\\;
\\underbrace{n}_{\\text{count}}
\\end{aligned}

    `.trim()
  }
]

export default function MathMlPage () {
  const mathMlRef = useRef<HTMLTextAreaElement>(null);
  const texRef = useRef<HTMLTextAreaElement>(null);
  const mathMlId = useId();
  const texId = useId();

    const onClickMathMlConvert = () => {
        const omml = mathMlToOmml(mathMlRef.current?.value ?? "")
        downloadWithContent(`
          <w:p>
            ${omml}
          </w:p>
        `);
    };

    const onClickTexConvert = async () => {
        const omml = mathMlToOmml(texToMathML(texRef.current?.value ?? ""))
        downloadWithContent(`
          <w:p>
            ${omml}
          </w:p>
        `);
    };

    return (
        <div style={{padding: 12}}>
            <div>
                <label htmlFor={mathMlId}>MathML</label>
                <textarea id={mathMlId} style={{display: "block", width: "100%", height: 200}} ref={mathMlRef} defaultValue={INITIAL_MATHML}></textarea>
                <button onClick={onClickMathMlConvert}>convert</button>
            </div>
            <div>
                <label htmlFor={texId}>Tex</label>
                <textarea id={texId} style={{display: "block", width: "100%", height: 200}} ref={texRef} defaultValue={INITIAL_TEX}></textarea>
                <div>
                  Examples: {TEX_EXAMPLES.map((example, exampleIndex) => {
                    return <>
                      <button
                        style={{
                          all: "unset",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                        onClick={() => texRef.current.value = example.math}
                      >
                        {example.name}
                      </button>
                      {exampleIndex < TEX_EXAMPLES.length -1 ? ", " : ""}
                    </>
                  })}
                </div>
                <button onClick={onClickTexConvert}>convert</button>
            </div>
        </div>
    )
}
