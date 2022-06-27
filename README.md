# lambda-vast-transformer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)

Lambda function that proxies a VAST/VMAP request and applies and modifies the response according
to a provided XSLT transform.

## Usage

```
https://<alb-lambda>/transform?vastUrl=<url-encoded>&xsltUrl=<url-encoded>
```

The following XSLT example removes all click-through elements:

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" encoding="utf-8" indent="yes"/>

  <xsl:template match="node()|@*">
    <xsl:copy>
        <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

  <!-- Drop VideoClicks -->
  <xsl:template match="VideoClicks"></xsl:template>

</xsl:stylesheet>
```

## Development

*NB: Only works in `node <15` because `libxslt` does not support v16 or higher.*

```
npm install
npm run dev
```

Development server is by default running on port 8000 and uses fastify to emulate an ALB to trigger Lambda function.

To try it out on your local environment

1. Start the development server
2. Start an HTTP server to serve the XSL example directory: `cd examples && python -m http.server 9000`

Observe that the URLs in the `vastUrl` and `xslt` query parameters need to be URL encoded as they may include `?` and `&` for example.

```
curl --compressed -v "http://localhost:8000/transform?vastUrl=https%3A%2F%2Feyevinn.adtest.eyevinn.technology%2Fapi%2Fv1%2Fvast%3Fdur%3D60&xslt=http%3A%2F%2Flocalhost%3A9000%2Fremove-click-through.xsl"
```

# About Eyevinn Technology

Eyevinn Technology is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor.

At Eyevinn, every software developer consultant has a dedicated budget reserved for open source development and contribution to the open source community. This give us room for innovation, team building and personal competence development. And also gives us as a company a way to contribute back to the open source community.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
