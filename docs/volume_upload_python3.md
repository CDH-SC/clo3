# Python Volume Upload Script <!-- omit in toc -->

This script loops through a given directory of XML files and seperates each
volume into individual sections/letters before formatting each section into
usable HTML that is then uploaded into MongoDB.

## Table of Contents <!-- omit in toc -->
- [Imported Modules](#imported-modules)
	- [Standard Modules](#standard-modules)
		- [re](#re)
		- [os](#os)
		- [json](#json)
		- [datetime](#datetime)
	- [3rd Party Modules](#3rd-party-modules)
		- [lxml](#lxml)
		- [pymongo](#pymongo)
		- [bs4](#bs4)
- [Functions](#functions)
	- [htmlHexConverter](#htmlhexconverter)
	- [linkFix](#linkfix)
	- [nameFix](#namefix)
	- [sluglineGen](#sluglinegen)
	- [xsltFormat](#xsltformat)
	- [footnoteFormat](#footnoteformat)
	- [letterUpload](#letterupload)
	- [main](#main)

---

## Imported Modules

### Standard Modules
#### re
This imports python's built-in Regex library which will be used for some
string manipulation in later functions.

#### os
This module provides some operating system dependent functionality. For this
script it is used to get a list of files in a directory and the paths to said files.

#### json
This provides support for JSON encoding and decoding and is used to read the
`manuscripts.json` and `frontice.json` files used by the script.

#### datetime
Used to record the runtime of the script by comparing the time when the script was
started to the time when the script finishes.

### 3rd Party Modules
#### lxml
Toolkit for processing XML and HTML. It is used to apply the XSLT styling from the
`xml_styling.xslt` stylesheet to convert the XML into HTML.

#### pymongo
Module for working with MongoDB from Python. It is used to connect to MongoDB and
upload the processed XML into the clo database.

#### bs4
Otherwise known as BeautifulSoup4. Used for parsing XML, navigating the parse tree,
and extracting the required data from the XML volumes.

---

## Functions

### htmlHexConverter


### linkFix

### nameFix

### sluglineGen

### xsltFormat

### footnoteFormat

### letterUpload

### main