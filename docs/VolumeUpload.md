# How to Use the Volume Upload Script <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->
- [Updating an Existing Volume](#updating-an-existing-volume)
	- [Step-by-Step](#step-by-step)
- [Uploading a New Volume](#uploading-a-new-volume)
	- [Step-by-Step](#step-by-step-1)
	- [Descriptive Steps](#descriptive-steps)
	- [Troubleshooting](#troubleshooting)

---

## Updating an Existing Volume
This process will need to be followed whenever changes are made to some of the volume
XML, either done by Brent on his personal branch `clo3-bek-working` or by a team member
to update part of the XML.

### Step-by-Step
* Use a branch other than master.
	* If updating with changes from Brent make sure to merge the `clo3-bek-working`
	branch into the current branch first.
* Run the `volume_upload_python3.py` script in the `clo-utils` directory.
* Verify that the new volume works by building the site locally.
* Update the MongoDB dump files with: `mongodump -d clo -o clo-database/current/`
	* This command should be run from the root CLO directory.
* Commit the new changes with Git and push to the branch.
* Create a pull request to merge the branch into master.

---

## Uploading a New Volume
This is a fairly rare occurance, usually only happening once a year when
a new volume XML is sent to us by Brent. Below is a step-by-step guide
on the volume upload process, if there are any issues there is also a
set of more descriptive steps that provide more detail on what each
step is meant to do.

### Step-by-Step
* Make a new Git branch for the volume upload.
* Add a link for the new volume to the `browse-subject` page.
* Ensure the new XML file follows the naming scheme `volume-vol#-P5.xml`
* Place the new XML file in the `clo-xml-archive` directory.
	* If we are also given an image/text for the frontispiece the
	`frontice.json` file in the `clo-xml-archive` directory will also
	need to be updated to include the new image and text.
* Run the `volume_upload_python3.py` script in the `clo-utils` directory.
* Verify that the new volume works by building the site locally.
* Update the MongoDB dump files with: `mongodump -d clo -o clo-database/current/`
	* This command should be run from the root CLO directory.
* Commit the new changes with Git and push to the branch.
* Create a pull request to merge the branch into master.

### Descriptive Steps
Brand new volumes are a fairly rare occurance, usually only happening
once or twice a year. When we get a new volume is determined by Brent
at WCU and his editorial team.

When a new volume is ready to be uploaded first create a new Git branch
for the volume upload. This is best practice and ensures that if
something were to go wrong that the master branch is unaffected.

Once a new volume is ready for upload it gets sent to us in the form of
an XML file; this file should follow the naming scheme of
`volume-"vol#"-P5.xml`. If for some reason this scheme is not followed
the file should be renamed to match the others.

After recieving the file it gets placed with the other XML files in the
`clo-xml-archive` directory and the `clo-xml-archive.zip` file can be
updated to include the new XML. The volumes also include a frontispiece
which usually has an image and some text, if we are given an image and 
text with the new volume the `frontice.json` file in the 
`clo-xml-archive` directory will also need to be updated. This will 
involve adding a new object to the array with the id being the volume 
number and the `imageUrl` and `imageCaption` being the path to the image 
and the image text respectively.

After adding the XML and updating the `frontice.json` file the 
`volume_upload_python3.py` script can be run in the `clo-utils` directory.
This script will go through and read all of the XML files and upload each 
volume, *including the new volume just added.*

Once the script is finished uploading the site can be built locally to 
verify that the new volume has been successfully uploaded.

After verifying that the volume has successfully been uploaded the
MongoDB dump files will need to be updated. This is done with the 
following command run from the root CLO directory:

>mongodump -d clo -o clo-database/current/

This command will take the current local data from MongoDB and output it 
into some JSON and BSON files. These files will be later used to update 
MongoDB on the dev site as well as other developer's local machines via 
the `mongorestore` command. Further documentation can be found [here](https://docs.mongodb.com/database-tools/mongodump/).

After updating the MongoDB dump files and verifying that the volume 
uploaded correctly the new changes can be commited and pushed to the 
working branch. After pushing the changes a pull request can be made to 
merge the new volume into master and the working branch can be closed.

### Troubleshooting
The script is fairly robust and is unlikely to encounter any breaking 
issues, but with a new volume there is always the possibilty of new 
formatting or style issues appearing.

Most style issues can be fixed by editing the volume XML files and fixing
any typos/errors there. Generally style issues in the XML will be fixed by
Brent on his working branch `clo3-bek-working` and those changes can be merged
into master and used to update the volume.

If there is a more widespread issue changes can be made to the `xml-styling.xslt`
file in `clo-utils`. This XSLT file is used by the volume upload script to determine
how the XML tags and formatting are transformed into the HTML tags that we use for the 
site.
