# Work on Manuscript Viewer: 11/11/20 - 11/18/20

## First Steps

The first task was to dig into any work previously done on the manuscript by past team members. I believe that this past work was primarily done by either Jerrod or Prithvi.

The manuscript images for the two letters used for testing can be found under `clo-angular/src/assets/manuscripts/`. With the images for each letter inside a folder named after that letters `xml_id`, e.g., `/lt-18320208-TC-JHLH-01/`.

After looking for any code related to the manuscript viewer the relevant files seemed to be `volume-content.component.html` and `volume-content.component.ts`, both found under `clo-angular/src/app/volume-content/`.

### volume-content.component.html

* This file handles the actual displaying of the manuscripts for any letters that contain them. The important line of code handling this is in line 1:

        <ng-container *ngIf="hasManuscript; else normalContainer">

* This line of code uses an angular container (`ng-container`) and an if statement (`*ngIf`) checking if the `hasManuscript` variable is true for the current letter.
* If `hasManuscript` returns true then the following block of code from lines 2-51 is used to display the manuscript images alongside the letter.
* If `hasManuscript` returns false then the letter has no associated manuscript images and the `normalContainer` angular template (`ng-template`) is used instead. This template is can be found in lines 53-96 of the same file.

### volume-content.component.ts

* This file handles all of the data for each letter as well as the volume specific sections such as the Introduction and Chronology. The relevant code for the manuscript viewer is all within the `getLetter` function found on lines 202-246.
* Specifically lines 235-244:

        // Check if the letter has a manuscript
        if (letter.hasOwnProperty('manuscript')) {
            this.hasManuscript = true;
            for (let i = 0; i < letter.manuscript.length; i++) {
                this.manuscriptUrl[i] = `assets/manuscripts/${letter.xml_id}/${letter.manuscript[i]}`;
        }
        console.log(this.manuscriptUrl);
        } else {
            this.hasManuscript = false;
        }

* The `letter` object is pulled from the database earlier in the `getLetter` function and this block of code first checks if the `manuscript` property exists for the letter. Any letters that have manuscript images should have this property defined as a field in MongoDB.
* If the `manuscript` property is found on the letter than the `hasManuscript` variable is set to true. This is the same variable used with the `*ngIf` statement in the html file looked at earlier.
* Then a `for` loop is used to go through an array in the `manuscript` property of the `letter` object and create an array called `manuscriptUrl` containing the file path to each manuscript image.

***

## Next Steps

All of the code on the front end necessary to display the images seemed to be in place, so the next steps were to take a look at the Mongo database and confirm the existence of the `manuscript` property that the `getLetter` function was looking for.

* Both of the example letters are from Volume 6 and were found in the database by using their letter `xml_id`.
* Neither of the letters contained a `manuscript` property or any other fields related to their manuscript images.

After finding that neither example letter contained the necessary `manuscript` property identifying that they have manuscript images a `manuscript` field was manually added to one of the letters with an array containing the names of it's manuscript images.

Once the `manuscript` field was added for one of the letters the site was built locally and the manuscript viewer was found to be working for that particular letter. Having now confirmed that all of the front end code worked properly and that the issue was with a missing `manuscript` field in the database a solution could then be worked on.

Manually adding a `manuscript` field for each letter with manuscript images is not a viable solution to the issue of the missing field. Any time that the database would get updated would result in the loss of those fields and having to re-add the fields again. For a permanent fix the letters with manuscript images need to identified in either the Volume XML files or in a separate file dedicated to the manuscript letters.

Editing the XML files for the potential hundreds of manuscript letters would have to be done by hand, resulting in a time consuming project that would be difficult to maintain or make additions to in the future. Instead a separate file will be created alongside the XML files that contains a list of the manuscript letters and the names of the images associated with them. The file is called `manuscripts.json` and is located in the `clo-xml-archive/` folder. This file can then be used by the `volume_upload_python3.py` script to ensure that whenever the database is updated the `manuscript` field is maintained for all manuscript letters.

### manuscripts.json

* This is a simple JSON file that contains the letter `xml_id` of all of the manuscript letters with an array of the images for each letter.
* An example of how one letter looks below:

        "lt-18320208-TC-JHLH-01": [
            "Page1.jpg",
            "Page2.jpg"
        ],

* The simple formatting of this file allows it to be easily updated in the future as new manuscript images are found for other letters.

### volume_upload_python3.py

* This script handles the formatting and uploading of all the volumes and letters found in the volume XML files.
* All of the changes made for the manuscript letters can be found in the letterUpload function on lines 177-251.
* Specifically lines 182-184:

        # get letters with manuscripts from json file
        with open('%smanuscripts.json' % directory) as g:
            manuscripts = json.load(g)

* And lines 238-239:

        if manuscripts.get(xml_id):
            letter['manuscript'] = manuscripts.get(xml_id)

* Lines 182-184 open the previously discussed `manuscripts.json` file and saves it's contents to the `manuscripts` variable.
* Lines 238-239 then use the letters `xml_id` to check if the current letter is in the `manuscript.json` file and has any manuscript images. If the letter is found in the `manuscript.json` file then the array of manuscript images is added to the `letter` dictionary object under the `manuscript` property.
* The letter is then uploaded to the Mongo database using the preexisting upload function of the script, only now with the correct `manuscript` property that can be used by the front end to properly display the manuscript letter.
