import * as core from '@actions/core'
import * as github from '@actions/github'
import axios, { AxiosResponse } from 'axios'

async function run() {
  try {
    // get inputs of the action
    const token = core.getInput('token', { required: true })
    const label = core.getInput('label', { required: false })
    const stigs = core.getInput('stigs-comment', { required: false })
    // get repo context
    const owner = github.context.repo.owner
    const repo = github.context.repo.repo
    // get issue context
    const issue_number = getIssueNumber()
    const issue_title = getIssueTitle()
    const issue_body = getIssueBody()
    // check whether issue exists
    if (issue_number === undefined || issue_title === undefined) {
      console.log('Could not get issue number or issue title from context, exiting')
      return
    }

    // A client to load data from GitHub
    const octokit = github.getOctokit(token)
    let issue_text =
      issue_title == null
        ? issue_body == null
          ? ''
          : issue_body
        : issue_body == null
        ? issue_title
        : issue_title + issue_body
    console.log('Issue full text: ', issue_text)

    // API call to ARQAN to classify the requirement
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
    let security_sentences: Array<string> = result.data.security_text

    // if answer from api has elements in the array,
    // then issue is security requirement
    if (security_sentences.length) {
      await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number,
        labels: [label]
      })
    }

    if (stigs === 'true') {
      // TODO: Make actual API call when API will be ready
      // fake api response
      let response =
        'Recommended STIG: [V-214961](https://www.stigviewer.com/stig/canonical_ubuntu_16.04_lts/2020-12-09/finding/V-214961).'
      // post a comment about recommended STIG
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body: response
      })
    }
    // TODO: search for stig in RQCODE
    // TODO: post a comment about already implemented test on the STIG or
    // TODO: Create Issue in RQCODE
    const { exec } = require('child_process')
    executeCommand('git clone https://github.com/anaumchev/VDO-Patterns.git', exec)
    executeCommand('find VDO-Patterns/src/rqcode/stigs -type d -name "V_214961"', exec)
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

function executeCommand(cmd: string, exec: any) {
  exec(cmd, (error: Error, stdout: string | Buffer, stderr: string | Buffer) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    return stdout
  })
}

run()
