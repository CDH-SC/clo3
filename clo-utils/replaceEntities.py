"""
This script runs through the clo-xml-archive directory, and it
replaces all of the unicode characters specified in the
'entities in CLO.txt' file and converts them to the HEX unicode
character.

Written by: Jerrod Mathis
Date: 12 April 2019
"""

import os
import sys
import re
from tempfile import mkstemp
from datetime import datetime
from shutil import move

start = datetime.now()
directory = "../clo-xml-archive/"

"""
    This dictionary is created from the entities specified
    in the 'entities in CLO.txt'.

    The key is the old 'named' HTML entity, and the value
    is the new 'hex' HTML entity.
"""
clo_entities = {
    '&mdash;': '&#x02014;',
    '&ndash;': '&#x02013;',
    '&ldquo;': '&#x0201c;',
    '&rdquo;': '&#x0201d;',
    '&lsquo;': '&#x02018;',
    '&rsquo;': '&#x02019;',
    '&hellip;': '&#x02026;',
    '& ': '&#x26;',
    '&c': '&#x26;c',
    '&frac12;': '&#xbd;',
    '&frac14;': '&#xbc;',
    '&frac18;': '&#x215b;',
    '&frac23;': '&#x2154;',
    '&frac34;': '&#xbe;',
    '&frac78;': '&#x215e;',
    '&egrave;': '&#x000e8;',
    '&agrave;': '&#x000e0;',
    '&aacute;': '&#x000e1;',
    '&sol;': '&#x0002f;',
    '&ouml;': '&#x000f6;',
    '&auml;': '&#x000e4;',
    '&iuml;': '&#x000ef;',
    '&eacute;': '&#x000e9;',
    '&acirc;': '&#x000e2;',
    '&ocirc;': '&#x000f4;',
    '&ucirc;': '&#xfb;',
    '&Acirc;': '&#xc2;',
    '&Icirc;': '&#xce;',
    '&dagger;': '&#x02020;',
    '&ddagger;': '&#x02021;',
    '&uuml;': '&#x000fc;',
    '&pound;': '&#x000a3;',
    '&deg;': '&#xb0;',
    '&shy;': '&#xad;',
    '&Agrave;': '&#xc0;',
    '&copy;': '&#xa9;',
    '&ugrave;': '&#x000f9;',
    '&times;': '&#xd7;',
    '&ccedil;': '&#xe7;',
    '&aelig;': '&#xe6;',
    '&Uuml;': '&#xdc;',
    '&emsp;': '&#x02003;',
    '&OElig;': '&#x152;',
    '&middot;': '&#xb7;',
    '&ecirc;': '&#xea;',
    '&iacute;': '&#xed;',
    '&frac13;': '&#x2153;',
    '&numsp;': '&#x2007;',
    '&amacr;': '&#x101;',
    '&icirc;': '&#xEE;',
    '&ecaron;': '&#x11B;',
}

"""
    This dictionary is used to keep track of how many of the 
    old keys appear in the current XML file.
"""
entity_counts = { key: 0 for key, _ in clo_entities.items() }

def main():
    for filename in os.listdir(directory):
        # Looking for the XML files in the specified directory
        if filename.endswith(".xml"):
            print('Opening {0}\n'.format(filename))
            fh, abs_path = mkstemp()
            # Opening new file to write to
            with os.fdopen(fh, 'w') as newFile:
                # Opening file to read from
                with open(os.path.join(directory, filename), "r") as fp:
                    line = fp.readline()
                    while line:
                        for key, value in clo_entities.items():
                            """
                            If the key exists in the line, we want
                            to set the line variable to be updated
                            with the string output from the
                            replace function.
                            """
                            if line.find(key) != -1:
                                entity_counts[key]+=1
                                line = line.replace(key, value)
                        # Write to the new file the updated line
                        # string
                        newFile.write(line)
                        line = fp.readline()
            """
            We are removing the old file from the directory
            and moving the new file in its place.
            """
            os.remove(os.path.join(directory, filename))
            move(abs_path, os.path.join(directory, filename))
            print("Entity Counts in {0}:\n".format(filename))
            for key, value in entity_counts.items():
                print('\t' + key + ' => ' + str(value))

if __name__ == "__main__":
    main()
    print("\n")
    print("Time elapsed: " + str(datetime.now() - start))