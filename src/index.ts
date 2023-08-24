import { ALBHandler, ALBEvent, ALBResult } from "aws-lambda";
import { readFileSync } from "fs";
import path from "path";

import { compress, fetchXslt, xsltProcess } from "./util";

const NODE_ENV = process.env.NODE_ENV;

const generateErrorResponse = ({ code: code, message: message }): ALBResult => {
  let response: ALBResult = {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Origin",
      'Access-Control-Allow-Private-Network': 'true',
    }
  };
  if (message) {
    response.body = JSON.stringify({ reason: message });
  }
  return response;
};


export const handler: ALBHandler = async (event: ALBEvent): Promise<ALBResult> => {
  const searchParams = new URLSearchParams(Object.keys(event.queryStringParameters).map(k => `${k}=${event.queryStringParameters[k]}`).join("&"));
  for (let k of searchParams.keys()) {
    event.queryStringParameters[k] = searchParams.get(k);
  }

  console.log(event);
  let response: ALBResult;
  try {
    if (event.path === "/transform" && event.httpMethod === "GET") {
      response = await handleTransform(event);
    } else if (NODE_ENV === "development" && event.path.match(/^\/examples\//) && event.httpMethod === "GET") {
      response = await serveXsltExample(event);
    } else {
      response = generateErrorResponse({ code: 404, message: "Resource not found" });
    }
  } catch (error) {
    console.error(error);
    response = generateErrorResponse({ code: 500, message: error.message ? error.message : error });
  }
  return response;
};

const handleTransform = async (event: ALBEvent): Promise<ALBResult> => {
  if (!event.queryStringParameters.vastUrl || !event.queryStringParameters.xslt) {
    throw new Error("Missing mandatory query parameters: [vastUrl, xslt]");
  }

  const vastUrl = new URL(event.queryStringParameters.vastUrl);
  const xsltUrl = new URL(event.queryStringParameters.xslt);

  try {
    const xsltXml = await fetchXslt(xsltUrl);

    let headers = {};
    Object.keys(event.headers).forEach(k => {
      if (k !== 'host') {
        headers[k] = event.headers[k];
      }
    });

    const response = await fetch(vastUrl.toString(), {
      headers: headers,
    });

    if (response.ok) {
      const vastXml = await response.text();
      const outXml = await xsltProcess(vastXml, xsltXml);

      const compressed = await compress(Buffer.from(outXml, "utf-8"));
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/xml",
          "Content-Encoding": "gzip",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Origin",
          'Access-Control-Allow-Private-Network': 'true',
        },
        body: compressed.toString("base64"),
        isBase64Encoded: true,
      }
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw new Error(error);
  }
}

const serveXsltExample = async (event: ALBEvent): Promise<ALBResult> => {
  const m = event.path.match(/^\/examples\/(.*)$/);
  if (m) {
    try {
      const exampleXsltFileName = m[1];
      const xslt = readFileSync(path.join("./examples/", exampleXsltFileName), {
        encoding: 'utf8'
      });

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/xml",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Origin",
          'Access-Control-Allow-Private-Network': 'true',
        },
        body: xslt,
        isBase64Encoded: false,
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}