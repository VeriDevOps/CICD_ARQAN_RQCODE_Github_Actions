import * as core from '@actions/core'
import * as github from '@actions/github'
import axios, { AxiosResponse } from 'axios'

async function run() {
  try {
    const token = core.getInput('token', { required: true })
    const issue_number = getIssueNumber()
    const issue_title = getIssueTitle()
    const issue_body = getIssueBody()
    if (issue_number === undefined || issue_body === undefined) {
      console.log('Could not get issue number or issue body from context, exiting')
      return
    }

    // A client to load data from GitHub
    const octokit = github.getOctokit(token)

    let result: AxiosResponse = await axios
      .post('http://51.178.12.108:8000/text', issue_title + issue_body, {
        headers: { 'Content-type': 'text/plain;' }
      })
      .then(
        (response) => {
          console.log(response.data)
          console.log(response.status)
          return response.data
        },
        (error) => {
          console.log(error)
          return error
        }
      )
    console.log(`Text: ${result}!`)
    // const time = (new Date()).toTimeString();

    // core.setOutput("time", time);
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

function getIssueNumber(): number | undefined {
  const issue = github.context.payload.issue
  if (!issue) {
    return
  }

  return issue.number
}

function getIssueTitle(): string | undefined {
  const issue = github.context.payload.issue
  if (!issue) {
    return
  }
  return issue.title
}

function getIssueBody(): string | undefined {
  const issue = github.context.payload.issue
  if (!issue) {
    return
  }

  return issue.body
}

run()
