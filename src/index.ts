import { ALBHandler, ALBEvent, ALBResult } from "aws-lambda";
import fetch from "node-fetch";

import { compress, fetchXslt, xsltProcess } from "./util";

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
    response.body = JSON.stringify({ reason: message });
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
    }
  } catch (error) {
    console.error(error);
    response = generateErrorResponse({ code: 500, message: error.message ? error.message : error });
  }
  return response;
};

const handleTransform = async (event: ALBEvent): Promise<ALBResult> => {
  const vastUrl = new URL(event.queryStringParameters.vastUrl);
  const xsltUrl = new URL(event.queryStringParameters.xslt);

  try {
    const xsltXml = await fetchXslt(xsltUrl);

    const response = await fetch(vastUrl.toString());
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