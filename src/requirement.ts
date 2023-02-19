import { getOctokit } from '@actions/github'
import ApiService from './apiService'
import { Stig } from './interfaces'

namespace Requirement {
  export async function isSecurity(issue: string): Promise<boolean> {
    console.log('In isSecurity function')
    // API call to ARQAN to classify the requirement
    let securitySentences = await ApiService.getSecuritySentences(issue).then(
      (result) => {
        return result.security_text
      },
      (error) => {
        throw new Error(
          `Received ${error.response.status} status code from ARQAN Classification Service for input: ${issue}.`
        )
      }
    )

    // if answer from api has elements in the array,
    // then issue is security requirement
    return !!securitySentences.length
  }

  export async function setIssueLabel(
    repo: { owner: string; repo: string },
    issueNumber: number,
    label: string,
    token: string
  ): Promise<void> {
    const octokit = getOctokit(token)
    console.log('ARQAN Classification Service encounters the current issue as security requirement.')

    console.log(`Setting label "${label}" on the current issue`)
    await octokit.rest.issues.addLabels({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
      labels: [label]
    })
  }

  export async function getStigs(requirement: string, platform: string): Promise<Stig[]> {
    // array for STIGs to the particular requirement
    let stigs: Array<Stig> = []

    let stig_urls = await ApiService.getRecommendedStigs(requirement, platform)
    if (Object.keys(stig_urls).length === 0) {
      return stigs
    }
    for (let key in stig_urls) {
      // get STIG ID from the url
      let url = stig_urls[key]
      let stig_id = url.split('/').pop()
      if (stig_id) {
        stigs.push({ id: stig_id, url: url })
      } else {
        throw new Error(`Couldn't get STIG ID from the url: ${url} returned by ARQAN`)
      }
    }
    return stigs
  }

  export async function commentRecommendedStigs(
    stigs: Stig[],
    repo: { owner: string; repo: string },
    issueNumber: number,
    token: string
  ): Promise<void> {
    // construct comment with recommended STIGs
    let comment = 'Recommended STIG:'
    for (let stig of stigs) {
      comment += `\r\n- [${stig.id}](${stig.url})`
    }

    const octokit = getOctokit(token)

    // post a comment about recommended STIG
    await octokit.rest.issues.createComment({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
      body: comment
    })
  }
}

export default Requirement
