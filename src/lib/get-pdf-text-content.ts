// import Pdfparser from 'pdf2json';
// import PdfParse from '@cyber2024/pdf-parse-fixed';
// import { readFileSync, writeFileSync } from 'fs';
// import { join } from 'path';
// import { getDocument } from 'pdfjs-dist';
import PdfParse from 'pdf-parse';

// import { PDFDocument } from 'pdf-lib';

// export const getPdfTextContent = async (buffer: Buffer) => {
//   const pdf = await PDFDocument.load(buffer);

//   pdf.getPages().forEach((page) => {
//     const content = page.setfi;

//     content?.entries().forEach(([key, value]) => {
//       console.log({ key, value });
//     });
//     // console.log({ page, contents: page.node.Contents() });
//   });

//   return '';
// };

// import pdf2text from 'pdf2text';

// import PdfReader from 'pdfreader';
// import PdfParse from 'pdf-parse';

// export const getPdfTextContent = async (buffer: Buffer) => {
//   return PdfParse(buffer).then((data) => {
//     console.log(data.text);

//     return data.text;
//   });
// };

// export const getPdfTextContent = async (buffer: Buffer) => {
//   const pages = await pdf2text(buffer);

//   return pages.flat().join('\n');
// };

// export const getPdfTextContent = async (buffer: Buffer) => {
//   const pdf = await getDocument(buffer).promise;

//   let textContent = '';
//   const numPages = pdf.numPages;

//   for (let i = 1; i <= numPages; i++) {
//     const page = await pdf.getPage(i);

//     const textLayer = await page.getTextContent({
//       includeMarkedContent: false,
//       disableCombineTextItems: false,
//     });

//     const pageTextContent = textLayer.items
//       .map((item) => ('str' in item ? item.str : null))
//       .filter((item): item is string => item !== null)
//       .join('\n');

//     textContent += pageTextContent;
//   }

//   return textContent;
// };

// export const getPdfTextContent = async (buffer: Buffer) =>
//   new Promise<string>((resolve, reject) => {
//     let textContent = '';

//     new PdfReader().parseBuffer(buffer, (err: unknown, item: { text: string }) => {
//       if (err) {
//         reject(err);
//       } else if (!item) {
//         resolve(textContent);
//       } else if (item.text) {
//         textContent += item.text;
//       }
//     });
//   });

// export const getPdfTextContent = async (buffer: Buffer) => {
//   const pdf = await getDocument(buffer).promise;

//   let textContent = '';

//   for (let i = 0; i < pdf.numPages; i++) {
//     const page = await pdf.getPage(i + 1);

//     console.log('textContent:', await page.getTextContent());

//     textContent += await page.getTextContent();
//   }

//   return textContent;
// };

// export const getPdfTextContent = (buffer: Buffer) =>
//   new Promise<string>((resolve, reject) => {
//     const parser = new Pdfparser();

//     parser.on('pdfParser_dataReady', () => {
//       // TODO: Uncurse this once the types are available.
//       // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
//       resolve((parser as any).getRawTextContent() as string);
//     });

//     parser.on('pdfParser_dataError', (errData) => {
//       reject(errData);
//     });

//     parser.parseBuffer(buffer);
//   });

export const getPdfTextContent = (buffer: Buffer) =>
  PdfParse(buffer).then((data) => {
    return data.text.replace(/\n+/g, '\n');
  });
