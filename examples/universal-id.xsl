<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" encoding="utf-8" indent="yes"/>

  <xsl:template match="VAST/@version">
    <xsl:attribute name="version">4.0</xsl:attribute>
  </xsl:template>

  <xsl:template match="node()|@*">
    <xsl:copy>
        <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="Ad/InLine/Creatives/Creative/Linear">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*" />
    </xsl:copy>
    <UniversalAdId idRegistry="mms.se">
      <xsl:value-of select="../../../Extensions/Extension/AdInfo/@customaid"/>
    </UniversalAdId>
  </xsl:template>

</xsl:stylesheet>