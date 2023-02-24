# Social media Front-end

## Intro

This is a Front-end for the Social Media API provided by Noroff.
It is a part of the delivery for Project Exam 2.

## How to get started

Register a user on the system and get started.

### Customization

In the variables-file we can, among other things, control:

- API Base Url
- Valid email domains
- Set max number of posts and profiles to load per api call.
- Password length
- Available emojies
- Regex controlling image filetypes, url- and username syntax.

## Installation and deploy instructions

### Install locally

- Download this repository with your preferred method OR clone the repo.
- If you downloaded the zip-file, please extract it.
- Open the GIT Bash to the main folder of the project. Default name: "project-exam-2-stian-git-main".
- To install dependencies, run the command: npm install
- To build the front-end. run the command: npm run build
- Run the command: npm install -g serve
- Then run the command: serve -s build

### Deploy from GitHub to Netlify (recommended)

- Clone this Repo
- Create a new site on Netlify and choose "Import an existing project"
- Locate the repo with the site and use the default settings before deploying.
- Netlify will perform the build process during deploy.
- Shortly the Website will be available.
- Access the new URL and get started.

### Deploy to other websites:

If you want to publish the site in alternative ways, do the following:

- Run the "npm run build"-command if you haven't already".
- Copy everything inside the "build"-folder and upload it to your webserver.
- The build expects the site to be hosted at root folder. (Check out how to use the homepage-field in the package.json if you need to run it in a subfolder.)
- Open the site in your browser.
