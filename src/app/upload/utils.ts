import * as pdfjsLib from "pdfjs-dist";
import { PDFWorker } from "pdfjs-dist";
import { useRouter } from "next/navigation";

export async function handleAnalyze  (url:string, activeTab:string, text:string, setLoading:any, setAnalyzeDisabled:any, router:any) {
    setAnalyzeDisabled(true);
    let extractedText = "";
    if(url!=="" && activeTab==="pdf"){
      console.log('entered if block')
      const worker = new Worker(new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url));
      
      // Set worker
      pdfjsLib.GlobalWorkerOptions.workerPort = worker;
      
      // Get PDF document
      const pdf = await pdfjsLib.getDocument({ url: url, verbosity: 0 }).promise;

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        extractedText += pageText + "\n";
      }
      // Clean up worker
      worker.terminate();

    }else if(text!=="" && activeTab==="text"){ // if it's a text input
      localStorage.setItem("textData", text);
      setLoading(true);
      router.push("/resultanalysis");
    }

    // send extracted text to OpenAI API, retrieve JSON response and format it in resultanalysis page.
    if(extractedText!==""){
      localStorage.setItem("textData", extractedText);
      setLoading(true); // set Loading bar
      router.push("/resultanalysis");
    }
  };