import { gzip } from "zlib";
import libxslt from "libxslt";

export const compress = async (input: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => gzip(input, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  }));
}

export const fetchXslt = async (xsltUrl: URL): Promise<string> => {
  const response = await fetch(xsltUrl.toString());
  if (response.ok) {
    const xml = await response.text();
    return xml;    
  } else {
    throw new Error(response.statusText);
  }
}

export const xsltProcess = async (sourceXml: string, xsltXml: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    libxslt.parse(xsltXml, (err, stylesheet) => {
      if (err) {
        reject(err);
      } else {
        stylesheet.apply(sourceXml, {}, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      }
    });
  });
}