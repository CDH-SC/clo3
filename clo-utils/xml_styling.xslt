

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="bold">
    <b>
      <xsl:apply-template select="@* | node()"/>
    </b>
  </xsl:template>

  <xsl:template match="row">
    <tr valign="top">
      <xsl:apply-templates select="@* | node()"/>
    </tr>
  </xsl:template>

  <xsl:template match="cell">
    <td>
      <xsl:apply-templates select="@* | node()"/>
    </td>
  </xsl:template>
</xsl:stylesheet>
