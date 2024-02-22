import "./App.css";
import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { TextContent, TextItem } from "pdfjs-dist/types/src/display/api";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

function App() {
  const [hasFileBeenSelected, setHasFileBeenSelected] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const [file, setFile] = useState<File | null>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setHasFileBeenSelected(true);
    setFile(event.target.files![0]);
  }

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  function formatText(texts: TextContent) {
    let textFinal = "";
    for (let i = 0; i < texts.items.length; i++) {
      const item = texts.items[i] as TextItem;
      textFinal += item.str;
    }
    console.log(textFinal);
  }

  return hasFileBeenSelected ? (
    <>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            renderTextLayer={true}
            onGetTextSuccess={(text) => formatText(text)}
            onGetTextError={(e) => console.log(e)}
          />
        ))}
      </Document>
    </>
  ) : (
    <>
      <label htmlFor="pdf_input">Select a pdf file</label>
      <input
        type="file"
        id="pdf_input"
        name="pdf_input"
        accept=".pdf"
        style={{ opacity: 0 }}
        onChange={handleInputChange}
      />
    </>
  );
}

export default App;
