import * as core from '@actions/core'
import * as github from '@actions/github'
import axios, { AxiosResponse } from 'axios'
import { resolve } from 'path'

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
      let response = ['https://www.stigviewer.com/stig/canonical_ubuntu_16.04_lts/2020-12-09/finding/V-214961']
      if (response.length !== 0) {
        // array for STIG IDs recommended to the particular requirement
        let stigs_ids: string[] = []

        // Issue comment content
        let body = 'Recommended STIG:'

        for (let url of response) {
          // get STIG ID from the url
          let stig_id = url.split('/').pop()
          if (stig_id) {
            // for each url in the response make a link in the comment
            body += `\r\n- [${stig_id}](${url})`

            // add STIG ID to array of all recommended stigs
            stigs_ids.push(stig_id)
          } else {
            throw new Error(`Couldn't get STIG ID from the url: ${url} returned by ARQAN`)
          }
        }

        // post a comment about recommended STIG
        await octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number,
          body: body
        })

        // INTERACTION with RQCODE repository goes here

        // search for stig in RQCODE
        body = 'Recommended RQCODE:'
        let new_issues =
          'Report about not realized tests for STIGs in [RQCODE](https://github.com/anaumchev/VDO-Patterns.git):'
        const { exec } = require('child_process')
        await executeCommand('git clone https://github.com/anaumchev/VDO-Patterns.git', exec)

        for (let stig_id of stigs_ids) {
          let stig_dir = stig_id.replace(/-/g, '_')
          await executeCommand(`find VDO-Patterns/src/rqcode/stigs -type d -name "${stig_dir}"`, exec)
            .then((data) => {
              console.log(data)
              body += `\r\n- [${stig_id}](https://github.com/anaumchev/VDO-Patterns/tree/master${data.slice(12)})`
            })
            .catch((err) => {
              // TODO: Create Issue in RQCODE
//              octokit.rest.issues.create({
//                owner: 'anaumchev',
//                repo: 'VDO-Patterns',
//                title: 'Test issue'
//              });              
              new_issues += `\r\n- ${stig_id}`
              // throw err
            })
        }
        const octokitForPatterns = github.getOctokit('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')
        await octokitForPatterns.rest.issues.create({
          owner: 'anaumchev',
          repo: 'VDO-Patterns',
          title: 'Test issue'
        });          
        
        // post a comment about already implemented test on the STIG in RQCODE or about their need in RQCODE
        if (body.length > 19)
          // if action found any test for recommended STIG in RQCODE,
          // we need to notify user about it
          await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number,
            body: body
          })
        else {
          // post a comment asking to create issues in RQCODE
          await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number,
            body: new_issues
          })
        }
      }
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

function executeCommand(cmd: string, exec: any): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error: Error, stdout: string | Buffer, stderr: string | Buffer) => {
      console.log(`Command: ${cmd}`)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
      if (error) {
        console.log(`error: ${error.message}`)
        reject(error)
        return
      } else {
        resolve(`${stdout}`)
      }
    })
  })
}

run()
