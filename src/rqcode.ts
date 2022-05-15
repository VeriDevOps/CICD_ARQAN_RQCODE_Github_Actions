import { Stig, Test, StigIssue } from './interfaces'
import { getOctokit } from '@actions/github'

namespace Rqcode {
  const rqcodeRepo = {
    owner: 'anaumchev',
    repo: 'VDO-Patterns',
    url: 'https://github.com/anaumchev/VDO-Patterns.git'
  }

  export async function cloneRepo() {
    const { exec } = require('child_process')
    await executeCommand(`git clone ${rqcodeRepo.url}`, exec)
  }

  export async function findTests(stigs: Stig[]): Promise<{ found: Test[]; missing: Stig[] }> {
    let found: Test[] = []
    let missing: Stig[] = []
    const { exec } = require('child_process')
    for (let stig of stigs) {
      const stigDir = stig.id.replace(/-/g, '_')
      await executeCommand(`find ${rqcodeRepo.repo}/src/rqcode/stigs -type d -name "${stigDir}"`, exec)
        .then((data) => {
          found.push({
            id: stig.id,
            url: stig.url,
            rqcode: `${rqcodeRepo.url.slice(0, 40)}/tree/master${data.slice(12)}`
          })
        })
        .catch((err) => {
          missing.push(stig)
        })
    }
    return { found, missing }
  }

  export async function commentFoundTests(
    tests: Test[],
    repo: { owner: string; repo: string },
    issueNumber: number,
    token: string
  ) {
    // construct comment with found test cases in RQCODE for recommended STIGs
    let comment = `See [RQCODE](${rqcodeRepo.url}) tests for recommended STIGs :smiley: :`
    if (tests) {
      for (let test of tests) {
        comment += `\r\n- [${test.id}](${test.rqcode})`
      }
    } else {
      comment = `[RQCODE](${rqcodeRepo.url}) doesn't have implemented tests for recommended STIGs currently :pensive:`
    }

    const octokit = getOctokit(token)

    // post a comment about found test cases in RQCODE for recommended STIGs
    await octokit.rest.issues.createComment({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
      body: comment
    })
  }

  export async function openIssues(stigs: Stig[], token: string): Promise<StigIssue[]> {
    let issuesUrls: StigIssue[] = []
    const octokit = getOctokit(token)
    for (let stig of stigs) {
      const {
        data: { url }
      } = await octokit.rest.issues.create({
        owner: rqcodeRepo.owner,
        repo: rqcodeRepo.repo,
        title: `Implement finding [${stig.id}]`,
        body: `${stig.url}`
      })
      issuesUrls.push({ id: stig.id, url: stig.url, issueUrl: url })
    }
    return issuesUrls
  }

  export async function commentMissingTests(
    issues: StigIssue[],
    repo: { owner: string; repo: string },
    issueNumber: number,
    token: string
  ) {
    if (issues) {
      // construct comment with missing test cases for recommended STIGs
      // and associated opened issues accordingly in RQCODE
      let comment = `Created issues about not realized tests for STIGs in [RQCODE](${rqcodeRepo.url}):`
      for (let issue of issues) {
        comment += `\r\n- [${issue.id}](${issue.issueUrl})`
      }
      const octokit = getOctokit(token)

      // post a comment about missing test cases for recommended STIGs
      // and associated opened issues accordingly in RQCODE
      await octokit.rest.issues.createComment({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: issueNumber,
        body: comment
      })
    }
  }

  async function executeCommand(cmd: string, exec: any): Promise<string> {
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
}

export default Rqcode
