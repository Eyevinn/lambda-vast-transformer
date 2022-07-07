<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output 
    method="xml" 
    encoding="utf-8" 
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" 
    doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" 
    indent="yes"/>

  <xsl:template match="VAST">
    <html>
      <head>
        <title>VAST transformed to Human Readable Page</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"></link>
        <link rel="stylesheet" href="https://newcss.net/theme/night.css"></link>
        <style>
          h3 {
            text-transform: uppercase;
            font-size: 1.5em;
          }
          video {
            width: 300px;
          }
        </style>
      </head>
      <body>
        <header>
          <b>Version: <xsl:value-of select="./@version"/></b><br/>
          <b>Nr of ads: <xsl:value-of select="count(Ad)" /></b>
        </header>
        <xsl:apply-templates select="Ad" />
      </body>
    </html>
  </xsl:template>

  <xsl:template match="Ad">
    <div>
      <h3><xsl:value-of select="./@id"/></h3>
      <xsl:element name="video">
        <xsl:attribute name="src">
          <xsl:value-of 
            select="./InLine/Creatives/Creative/Linear/MediaFiles/MediaFile[@type='video/mp4']"
            disable-output-escaping="yes"
          />
        </xsl:attribute>
        <xsl:attribute name="controls" />
        <xsl:attribute name="playsinline" />
        <xsl:attribute name="muted" />
      </xsl:element>
      <p>
        <xsl:value-of select="./InLine/Creatives/Creative/Linear/Duration"/>
        <xsl:apply-templates select="./InLine/Creatives/Creative/Linear/VideoClicks" />
      </p>
    </div>
  </xsl:template>

  <xsl:template match="VideoClicks">
    |
    <xsl:element name="a">
      <xsl:attribute name="href"><xsl:value-of select="./ClickThrough" /></xsl:attribute>
      <xsl:text>CT</xsl:text>
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>