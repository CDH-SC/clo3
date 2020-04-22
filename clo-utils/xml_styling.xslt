<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="bold">
    <b>
      <xsl:apply-template select="@* | node()"/>
    </b>
  </xsl:template>

  <xsl:template match="row">
    <tr>
      <xsl:apply-templates select="@* | node()"/>
    </tr>
  </xsl:template>

  <xsl:template match="cell">
    <td>
      <xsl:apply-templates select="@* | node()"/>
    </td>
  </xsl:template>

  <xsl:template match="div3">
    <slugline><xsl:value-of select="head"/>
      <xsl:text>; </xsl:text>

      <xsl:apply-templates select="bibl"/>
      DOI: 10.1215/%s
      <i>CL</i>
      %s:%s-%s.
    </slugline>

    <xsl:apply-templates select="head"/>

    <xsl:apply-templates select="docBody"/>
  </xsl:template>

  <xsl:template match="div1">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="head">
    <p>
      <br/>
      <b><xsl:apply-templates/></b>
    </p>
  </xsl:template>

  <xsl:template match="title">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="dateline">
    <p>
      <xsl:apply-templates select="@* | node()"/>
    </p>
  </xsl:template>

  <xsl:template match="hi">
    <xsl:if test='@rend="italic"'>
      <i><xsl:apply-templates/></i>
    </xsl:if>

    <xsl:if test='@rend="bold"'>
      <strong><xsl:apply-template/></strong>
    </xsl:if>
  </xsl:template>

  <xsl:template match="corr">
    <xsl:value-of select="."/>
  </xsl:template>

  <xsl:template match="bibl">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="listBibl/bibl">
    <p>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="docAuthor/name">
    <p>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="docBody/name">
    <p>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="closer">
    <p>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="sic">
    <span style="display:none;"><xsl:apply-templates/></span>
  </xsl:template>

  <xsl:template match="docBody">
    <docBody>
      <xsl:apply-templates/>
    </docBody>
  </xsl:template>

  <xsl:template match="salute">
    <p>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="p">
    <p>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="author">
    <xsl:apply-templates select="@* | node()"/>
  </xsl:template>

  <xsl:template match="q">
    <p style="margin-left:20px;">
      <xsl:apply-templates select="@* | node()"/>
    </p>
  </xsl:template>

  <xsl:template match="title">
    <p>
      <center>
        <xsl:apply-templates select="@* | node()"/>
      </center>
    </p>
  </xsl:template>

  <xsl:template match="lg">
    <div class="lg">
      <xsl:apply-templates select="@* | node()"/>
    </div>
    <!-- <br/> -->
  </xsl:template>

  <xsl:template match="lb">
    <br/>
    <span>
      <xsl:apply-templates select="@* | node()"/>
    </span>
  </xsl:template>

  <xsl:template match="l">
    <div class="l" style="padding: 0 23px 0px 50px;">
      <xsl:apply-templates select="@* | node()"/>
    </div>
  </xsl:template>

  <xsl:template match="bold">
    <strong>
      <xsl:apply-templates select="@* | node()"/>
    </strong>
  </xsl:template>

  <xsl:template match="note">

    <xsl:variable name="number">
      <xsl:value-of select="@n"/>
    </xsl:variable>
    <sup>
      <a id="{concat('FN', $number, '_REF')}" tabindex="2" onClick="scrollToFootnote('{concat('#FN', $number)}')" class="tx_sup"><xsl:value-of select="$number"/></a>
    </sup>
  </xsl:template>

  <xsl:template match="figure">

    <xsl:variable name="image">
      <xsl:value-of select='graphic/@url'/>
    </xsl:variable>

    <xsl:choose>

      <xsl:when test="substring($image,1,1)='v'">

        <xsl:variable name="image-expanded">
          <xsl:value-of select="concat(substring-before($image,'.gif'),'_expanded.gif')"/>
        </xsl:variable>
        <a class="fancybox" href="assets/images/{$image-expanded}">
          <img id="letterimage" src="assets/images/{$image}" alt="{$image}"/></a>
        <br/>

        <xsl:apply-templates select="@* | node()"/>
      </xsl:when>

      <xsl:otherwise>

        <xsl:variable name="image-expanded">
          <xsl:value-of select="concat(substring-before($image,'.gif'),'_expanded.gif')"/>
        </xsl:variable>
        <a class="fancybox" href="assets/images/{$image-expanded}">
          <img id="letterimage" src="assets/images/{$image}" alt="{$image}"/></a>

        <xsl:apply-templates select="graphic"/>
        <xsl:apply-templates select="@* | node()"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="graphic">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="figure/p">

    <xsl:if test="string(.)">
      <p style="font-size:10px">
        <xsl:apply-templates select="@* | node()"/>
      </p>
    </xsl:if>
  </xsl:template>

  <!-- <xsl:template match="figure/p[last()]">

    <xsl:if test="string(.)">
      <span style="font-size:10px">
        <xsl:apply-templates select="@* | node()"/>
      </span>
    </xsl:if>
  </xsl:template> -->

<!-- Handles links -->
  <xsl:template match="ref">

    <!-- variable for testing type of link -->
    <xsl:variable name="testlink">
      <xsl:value-of select='substring(@target, 11,2)'/>
    </xsl:variable>

    <xsl:choose>
      <!-- if link is for ODNB -->
      <xsl:when test="$testlink = 'ht'">

        <xsl:variable name="odnb_link">
          <xsl:value-of select='substring(@target, 11)'/>
        </xsl:variable>

        <a href="{$odnb_link}"><xsl:apply-templates/></a>
      </xsl:when>
      <!-- if link is for a letter -->
      <xsl:otherwise>

        <xsl:variable name="id">
          <xsl:value-of select='substring(@target, 11)'/>
        </xsl:variable>

        <xsl:variable name="vol">
          <xsl:value-of select='substring(@target, 8,3)'/>
        </xsl:variable>

        <a href="{concat('../volume', '/', $vol, $id)}"><xsl:apply-templates/></a>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:text></xsl:text>
  </xsl:template>

  <xsl:template match="table">
    <table cellpadding="0" cellspacing="10">
      <xsl:apply-templates select="@* | node()"/>
    </table>
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

  <xsl:template match="hi">
    <xsl:if test='@rend="italic"'>
      <i><xsl:apply-templates/></i>
    </xsl:if>

    <xsl:if test='@rend="small-caps"'>

      <xsl:variable name="lower" select="text()"/>

      <xsl:variable name="upper" select="translate($lower, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
      <small><xsl:value-of select="normalize-space($upper)"/></small>
    </xsl:if>

    <xsl:if test='@rend="bold"'>
      <strong><xsl:apply-template/></strong>
    </xsl:if>
  </xsl:template>

  <xsl:template match="person">
    <xsl:value-of select="text()"/>
  </xsl:template>

  <xsl:template match="author/person">
    <xsl:apply-templates select="@* | node()"/>
  </xsl:template>

  <xsl:template match="@*|node()">

    <xsl:copy>
      <xsl:apply-templates/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="docDate">

    <xsl:value-of select="."/>
    <xsl:text>;</xsl:text>
  </xsl:template>

  <xsl:template match="name">
    <xsl:apply-templates select="@* | node()"/>
  </xsl:template>

  <xsl:template match="foreign">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="sourceNote"></xsl:template>

  <xsl:template match="docAuthor"></xsl:template>

  <xsl:template match="idno"></xsl:template>

  <xsl:template match="a">
    <xsl:variable name="link">
      <xsl:value-of select='substring(@href, 1)'/>
    </xsl:variable>

    <a href="{$link}"><xsl:apply-templates/></a>
  </xsl:template>

</xsl:stylesheet>
