# Project Structure

To help separate and organize the different elements of the CLO the project is broken down into seven main subdirectories:

- bin
- clo-angular
- clo-api
- clo-database
- clo-utils
- clo-xml-archive
- docs

This document aims to give a brief description of the functions of each element and an explanation of their structure.

------

## bin

The `bin` directory contains all of the scripts used to build the site and was created to simplify the building process and move away from the old Docker method.

A detailed breakdown and description of each of the scripts and the overall build process can be found in the project's base `README.md` file.

------

## clo-angular

This contains all of the Angular source code for the front-end of the project.

### angular.json

### src/app/app.module.ts

- e2e `This would contain tests for the site, but currently none exist`
- src `Contains all source code for Angular front-end`
  - app `All Angular components live here`
    - _shared `Services and models shared with other components`
      - _services `Services handling connections to the api`
      - models `Defines data models for results back from api`
      - pipes `Functions to sort/filter data`
    - about `contains all components related to the about pages`
      - about-carlyles
      - about-citing
      - about-editors
      - about-printed
      - about-project
      - about-supporters
      - about-technical
    - advanced-search `Handles everything related to advanced search`
    - album-viewer `Grid display of images inside photo album`
    - browse-recipient `Old page for viewing letters by recipients, no longer used`
    - browse-subject `Old page for viewing subject terms`
    - browse-volume `Default page for viewing volumes`
    - footer `Footer element used across the site`
    - header `Header element used across the site`
    - home `Site landing page`
    - nav `Navbar used across the site`
    - photo-album `Home page for browsing photo albums`
    - photo-viewer `Image viewer page for the photo albums`
    - rubenstein `Contains lists of letters from Rubenstein collection`
    - search-results `Search result page, used for basic search`
    - search `Search box element`
    - subject-letters `Test page for showing letters related to a subject term`
    - subject-terms `Test page for viewing subject terms, not used yet`
    - twitter `Twitter feed element, used on home page`
    - volume-content `Handles all the data for viewing volumes and letters`
    - volume-toc `TOC element used when viewing contents of a volume`
    - volume-viewer `Displays text and source/footnotes of current letter`
  - assets `Holds all images used across the site`
    - about-page `Images specific to the about pages`
    - albums/fullsize `Photo album images, separated by album`
    - frontice_images `Images for the volume frontispieces`
    - images `Images embedded inside letters`
    - manuscripts `Manuscript images, mostly for letters from the Rubenstein collection`
    - rubenstein-page `Images used on the Rubenstein collection page`
  - environments `Holds environment variables used for building the dev/prod site`

------

## clo-api

This contains the source code for the project's Node.js and Express.js backend. It is broken into five main sections.

### app.js

This is the main Node.js file and establishes the connection to both MongoDB and Elasticsearch. The MongoDB connection is handled by mongoose and the Elasticsearch connection is configured in the `elasticCilent.js` file. More documentation about Elasticsearch can be found in the `docs/elasticsearch` directory.

### routes

### controllers

### services

### models

- bin `Scripts for setting up Elasticsearch and www file defining server properties`
- controllers
- models
- public/stylesheets
- routes
  - api
- services
- views

------

## clo-database

- backup/clo
- current/clo
- db

------

## clo-utils

- legacy
- rubenstein

------

## clo-xml-archive



------

## docs

This one is pretty self-explanatory, it is a centralized location for all of the documentation about the project.