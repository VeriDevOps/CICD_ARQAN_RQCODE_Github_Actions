import * as core from '@actions/core'
import * as github from '@actions/github'
import axios, { AxiosResponse } from 'axios'

async function run() {
  try {
    const token = core.getInput('token', { required: true })
    const owner = github.context.repo.owner
    const repo = github.context.repo.repo
    const issue_number = getIssueNumber()
    const issue_title = getIssueTitle()
    const issue_body = getIssueBody()
    if (issue_number === undefined || issue_title === undefined) {
      console.log('Could not get issue number or issue title from context, exiting')
      return
    }

    // A client to load data from GitHub
    const octokit = github.getOctokit(token)
    console.log(issue_title + issue_body)
    let issue_text =
      issue_title == null
        ? issue_body == null
          ? ''
          : issue_body
        : issue_body == null
        ? issue_title
        : issue_title + issue_body
    console.log(issue_text)
    let result: AxiosResponse = await axios
      .post('http://51.178.12.108:8000/text', issue_text, {
        headers: { 'Content-type': 'text/plain;' }
      })
      .then(
        (response) => {
          return response
        },
        (error) => {
          console.log(error)
          return error
        }
      )
    let security: Array<string> = result.data.security_text
    if (security.length) {
      octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number,
        labels: ['secure']
      })
    }
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
