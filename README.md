# lambda-vast-transformer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)

Lambda function that proxies a VAST/VMAP request and applies and modifies the response according
to a provided XSLT transform.

## Usage

```
https://<alb-lambda>/transform?vastUrl=<url-encoded>&xslt=<url-encoded>
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

```
npm install
npm run dev
```

Development server is by default running on port 8000 and uses fastify to emulate an ALB to trigger Lambda function.

Observe that the URLs in the `vastUrl` and `xslt` query parameters need to be URL encoded as they may include `?` and `&` for example.

A set of examples are available in the examples folder that is served via the `/examples` endpoint, e.g. `http://localhost:8000/examples/remove-click-through.xsl`. So to try it out you can just run the following command:

```
curl --compressed -v "http://localhost:8000/transform?vastUrl=https%3A%2F%2Feyevinn.adtest.eyevinn.technology%2Fapi%2Fv1%2Fvast%3Fdur%3D60&xslt=http%3A%2F%2Flocalhost%3A8000%2Fexamples%2Fremove-click-through.xsl"
```

## Commercial Options

The VAST Transformer is released as open source but we do offer some commercial options in relation to it. 
Contact sales@eyevinn.se if you are interested for pricing and more information.

### Hosting

We host the service in our environment for a monthly recurring fee. Included is business hours support on a best effort basis.

### Deployment

We help you deploy and integrate the service in your environment on a time-of-material basis. 

### Feature Development

When you need a new feature developed and does not have the capacity or competence of your own to do it, we can on a time-of-material introduce this feature in the current code base and under the current open source license. 

### Professional Services and Development

When you need help with building for example integration adaptors or other development in your code base related to this open source project we can offer a development team from us to help out on a time-of-material basis. 

# About Eyevinn Technology

Eyevinn Technology is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor.

At Eyevinn, every software developer consultant has a dedicated budget reserved for open source development and contribution to the open source community. This give us room for innovation, team building and personal competence development. And also gives us as a company a way to contribute back to the open source community.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
