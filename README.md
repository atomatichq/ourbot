ChatOps Bot for our Gitter Chat Channel
=======================================

[![Build Status](https://travis-ci.org/datopian/ourbot.svg?branch=master)](https://travis-ci.org/datopian/ourbot)

Our Hubot-based bot to automate lots of stuff including:

- logging of specific messages from our (gitter) chat channel. See #1

# How to use it

To get `help` command, run the following code:
`bot help` - to get general help message information

`/bot` or `bot` - to see available functionalities of `bot`. 

## Commands

To create and close milestone:
```
bot create milestone "title" in "myorg/myrepo"
bot close milestone "title" in "myorg/myrepo"
```
To create and close all milestones listed in `config.json`:
```
bot create milestone all "title" 
bot close milestone all "title"
```
`title` - can accept the following values:
- any date in the format of `DD MMM YYYY`
- any string
For example: "13 Jan 2017" or "This is Backlog" 

Examples:

```
bot create milestone "15 Sept 2017" in "datahq/docs"
bot create milestone all "15 Sept 2017"
bot close milestone "15 Sept 2017" in "datahq/docs"
```

To create an issue on GitHub:

```
bot issue "title" about "body" in "myorg/myrepo"
bot issue "title" in "myorg/myrepo"
```
`title` - the title of the issue.
`body` - the contents of the issue.

Example:
```
bot issue "title of the issue" about "body" in "datahq/docs"
bot issue "title of the issue" in "datahq/docs"
```
## Tags

Bot can listen to a predefined channels, configured in `config.json`

To get url for todos and links:
```
bot integrities
bot links
bot standups
bot todos
bot promises
bot outcomes
bot feedback
```

In your chat channel tag at start, middle or end of a message: `+todo`, `+standup`, `+examples`, `+link`, `+integrity`, `+promise`, `+outcome`, `+feedback`
- `+outcome*` consists of 3 main attributes separated by comma. For example, `+outcome 100%,80%,50%`
The order should be: preparation, done, satisfaction/felt. In total 10 score(3,4,3).
Bot will respond with the total score: `Outcome recorded: your score was 7.5/10`

```
+todo ...
...  +todo ...

... +todo
```

This will get logged to the Google doc, Gist or both (depends on configuration) with the following format:

```
action, timestamp, poster, assignees, message, room
+todo,yyyy-mm-ddTHH:MM,@{username}(name),@{username},your message,roomname
```

```
+standup
blockers: none
last24:
* migrate old data.okfn.org docs
next24:
* Add support for admonitions
```
```
action, timestamp, poster, standup
+standup,yyyy-mm-ddTHH:MM,@{username}(name),standup_message
```

# Deploying and Configuring the Bot

We deploy using Heroku.

1. Configure the app with key config information
2. Deploy the app to heroku in the normal way - `git push heroku master` (our app name is `datopian-chatbot`)
3. Setup `hubot-heroku-keepalive` per instructions https://github.com/hubot-scripts/hubot-heroku-keepalive This avoids Heroku putting bot in idle state which stops it listening to the channel.

At this point you should have scheduled time for bot to wake up, but you can do it manually as well, by just visiting https://datopian-chatbot.herokuapp.com/heroku/keepalive

## Configuration

There are two parts to configuration:

* Behaviour (e.g. where we log stuff) - stored in `config.json` and kept in repo
* Access permissions for google docs and gists (this info has to be private)

### Behaviour

```javascript=
// some of this should be auto loaded from environment variables (so we can config on heroku)

// config.json
{
    "docs": {
        "gdoc1": {
            "fun": "sendMessage",
            "dest": "gdocid1"
            "room": "roomName"
        },
        "gist1": {
            "fun": "sendGist",
            "dest": "gistid"
            "room": "roomName"
        },
        "gdoc2": {
            "fun": "sendMessage",
            "dest": "gdocid2"
            "room": "roonName"
        }
    },
    "monitor": {
        "+todo": {
            "action": "log",
            "dest": ["gdoc1", "gist1"]
        },
        "+standup": {
            "action": "log",
            "dest": ["gdoc1"]
        },
        "+example": {
            "action": "log",
            "dest": ["gdoc2"]
        }
    }
}
```

With the configurations above bot will log `+todo`'s in one of Google docs and Gist,
`+standup`'s only in Google doc and `+example` in another Google doc

### Access Configuration

Copy the environment variables template to `.env`:

1. Rename ```env.example``` to ```.env``` and set variables:
```
GOOGLE_PRIVATE_KEY="<private_key from JSON file you get from Google>"
GOOGLE_CLIENT_EMAIL=<client_email from JSON file you get from Google>
HUBOT_GITTER2_TOKEN=<Gitter tocken>
GIST_USERNAME="<BOT_USERNAME>"
GIST_PASSWORD="<BOT_PASSWORD>"
GITHUB_TOKEN=<github token generated by datopianbot>
```

Locate values for each of these from the relevant services -- see below for instructions.

Then push this to heroku:

```
$ heroku config:set VARIABLE_NAME=VaRIabLE

## Note: To set `GOOGLE_PRIVATE_KEY` you will have to remove all `\n`s with actual new lines

$ heroku config:set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your
very
long
key
-----END PRIVATE KEY-----"
```

#### Gitter

1. Open [gitter dev site](https://developer.gitter.im/docs/welcome)
2. Click Sign in and authorize
3. You will be redirected in private area where you can find your API key, COPY IT!

#### Google Sheets

1. Go to the [Google Developers Console](https://console.developers.google.com/project)
2. Select your project or create a new one (and then select it)
3. Enable the Drive API for your project
  - In the sidebar on the left, expand __APIs & auth__ > __APIs__
  - Search for "drive"
  - Click on "Drive API"
  - click the blue "Enable API" button
4. Create a service account for your project
  - In the sidebar on the left, expand __APIs & auth__ > __Credentials__
  - Click blue "Add credentials" button
  - Select the "Service account" option
  - Select the "JSON" key type option
  - Click blue "Create" button
  - your JSON key file is generated and downloaded to your machine (__it is the only copy!__)
  - note your service account's email address (also available in the JSON key file)
5. Share the doc (or docs) with your service account using the email noted above
6. Get Worksheet ID:
    * Open or create google document
      * Format your document with next columns: action, timestamp, poster, assignees, message, room
    * Look at URL and find this one section:
    * https://docs.google.com/spreadsheets/d/**15dxhLpRnc1_weGE2rdfSYx7FpQfakbSXrh93cMRIuwsFow**/edit#gid=0
    * Set it to `dest` property in config.json:
      ```
      {
        "docs": {
          "gdoc1": {
              "fun": "sendMessage",
              "dest": "15dxhLpRnc1_weGE2rdfSYx7FpQfakbSXrh93cMRIuwsFow"
          },
          ...
      }
      ```
      
#### GitHub

1. Login into github as a `datopian` user
2. In settings, go the the `Personal access tokens`
3. Click on `generate new token` and click on actions you need.
4. Save generated token in `.env` as `GITHUB_TOKEN`

### Gists

1. You need to create a gist, by the bot account with name "log.txt"
2. Extract gist id from it's URL
3. Set it to `dest` property in config.json as shown in example above



# Developer Installation

You'll need to install coffee-script and hubot to run the app and tests. To install follow here:

```
npm install -g hubot coffee-script
```

Install the app:
```
# clone the repo
git clone https://github.com/atomatichq/ourbot.git
cd ourbot
npm install
```
Run the tests
```
npm test
```

### Run Locally

2. Open terminal and go in project folder.
3. Enter next script:
```
  HUBOT_GITTER2_TOKEN=<APIKEY which you get in previous step> bin/hubot -a gitter2 --name ourbot
```

