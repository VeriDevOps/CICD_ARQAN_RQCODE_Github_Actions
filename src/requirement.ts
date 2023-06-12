import {getOctokit} from '@actions/github'
import ApiService from './apiService'
import {Stig} from './interfaces'

namespace Requirement {
    export async function isSecurity(api_url: string, issue: string, token: string): Promise<boolean> {
        // API call to ARQAN to classify the requirement
        let securitySentences = await ApiService.getSecuritySentences(api_url, issue, token).then(
            (result) => {
                return result.requirements
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

    export async function getStigs(api_url: string, requirement: string, platform: string, limit: number, token: string): Promise<Stig[]> {
        // array for STIGs to the particular requirement
        let stigs: Array<Stig> = []
        let response = await ApiService.getRecommendedStigs(api_url, requirement, platform, limit, token)
        if (response.length === 0) {
            return stigs
        }
        response.forEach((stig) => {
            stigs.push(
                {
                    id: stig['id'],
                    url: stig['url'],
                    platform: stig['platform'],
                    title: stig['title'],
                    source: stig['source'],
                    description: stig['description'],
                    severity: stig['severity']
                })
        })
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
            comment += `\r\n    - ${stig.platform}`
            comment += `\r\n    - ${stig.title}`
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
