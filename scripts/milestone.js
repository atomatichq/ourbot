// npm install github-api
let Issue = require('../node_modules/github-api/dist/components/Issue.js')
let config = require('../config.json')

// create milestones all
let createMilestoneAll = (title, myDate) => {
  config.repos.forEach(repo => {
    let issueObj = new Issue(repo.owner+'/'+repo.repo, {token: process.env.GITHUB_TOKEN})
    let milestoneData = {
      "title": "Sprint - "+title,
      "state": "open",
      "description": "",
      "due_on": myDate
    }
    return issueObj.createMilestone(milestoneData)
  })
}
// create milestone 
let createMilestone = (owner, repo, title, myDate) => {
  let issueObj = new Issue(owner+'/'+repo, {token: process.env.GITHUB_TOKEN})
  let milestoneData = {
    "title": "Sprint - "+title,
    "state": "open",
    "description": "",
    "due_on": myDate
  }
  return issueObj.createMilestone(milestoneData)
}
// close milestone all
let closeMilestoneAll = (title) => {
  config.repos.forEach(repo => {
    let issueObj = new Issue(repo.owner+'/'+repo.repo, {token: process.env.GITHUB_TOKEN})
    issueObj.listMilestones().then(function(result) {
      for (var i = 0; i < result.data.length; i++) {
        if(result.data[i].title === title) {
          let milestone = result.data[i].number
          let milestoneData = {
            "state": "closed",
          }
          return issueObj.editMilestone(milestone, milestoneData)
        }
        else {
          return "Failed"
        }
      }
    })
  })
}
// close milestone
let closeMilestone = (owner, repo, title) => {
  let issueObj = new Issue(owner+'/'+repo, {token: process.env.GITHUB_TOKEN})
  issueObj.listMilestones().then(function(result) {
    for (var i = 0; i < result.data.length; i++) {
      if(result.data[i].title === title) {
        let milestone = result.data[i].number
        let milestoneData = {
          "state": "closed",
        }
        return issueObj.editMilestone(milestone, milestoneData)
      }  
    }
  })
}

module.exports = {
  createMilestoneAll,
  createMilestone,
  closeMilestoneAll,
  closeMilestone
}