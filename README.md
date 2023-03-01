# MyFriends

![image](https://tekniskpotet.no/img/myfriends-screenshot.jpg)

A social media with user interaction.

# Table of Contents

- [Description](#description)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Deploying](#deploying)
- [Contributing](#contributing)
- [Contact](#contact)

## Description

My school offers a backend that stores posts, users and comments.

I used React to build this responsive social media that includes several common features expected from a social media.

I was also able to add a feature that shows if someone has replied to a previous comment.

All students use the same backend with different front-ends, so the content changes like a live environment.

Here are some of the features for this project:

- Publish, edit and delete own posts
- Write comments
- React with emojis
- Follow users
- User Authentication
- Search and filter posts and users
- Edit userprofile
- Image modal
- View all activity from a user

## Built With

You can list a the tech stack that you've used over here

- [React.js](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com)

## Getting Started

Just register a user on the system and get started. It should be quite easy to get started and get the hang of it, once you are logged in.

It's worth mentioning that supported image extensions may differ from what the backend supports. It's controlled through regex and will inform the user upon saving.

This site is hosted on the following url for testing purposes:
[https://quiet-pavlova-2a196b.netlify.app/](https://quiet-pavlova-2a196b.netlify.app/)

### Installing

This is where you list how to get the project started. It typically just includes telling a person to clone the repo and then to install the dependencies e.g.

1. Clone the repo:

```bash
git clone Noroff-FEU-Assignments/project-exam-2-stian-git
```

2. Install the dependencies:

```
npm install
```

### Configuration

No configuration needed, but you may tweak some settings in src/constants/variables.js before you run or deploy it.

### Run locally

To run the app, run the following commands:

```bash
npm run start
```

## Deploying

Some ways to deploy this frontend follows:

### Deploy to Netlify

- Clone this Repo
- Create a new site on Netlify and choose "Import an existing project"
- Locate the repo with the site and use the default settings before deploying.
- Netlify will perform the build process during deploy.
- Shortly the Website will be available.
- Access the new URL and get started.

### Deploy to other pages

If you want to publish the site in alternative ways, do the following:

- Run the "npm run build"-command if you haven't already".
- Copy everything inside the "build"-folder and upload it to your webserver.
- The build expects the site to be hosted at root folder. (Check out how to use the homepage-field in the package.json if you need to run it in a subfolder.)
- Open the site in your browser.

## Contributing

This was made for a school project so I'm not planning for regular maintenance, but rather use it to show some of my work.
However I will welcome feedback, suggestions and ideas. Please reach me through the contact information below.

## Contact

The best way to reach me would be through the following sites:

[My Portfolio](https://tekniskpotet.no)

[My LinkedIn page](https://www.linkedin.com/in/stian-martinsen-stormyr-1662a515/)
