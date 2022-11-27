import { getInput, setFailed } from '@actions/core'
import { sanitizeUrl } from "@braintree/sanitize-url";
import { getRepo, getIssue } from './github'
import Requirement from './requirement'
import Rqcode from './rqcode'

async function run(): Promise<void> {
  try {
    // get inputs of the action
    const rqcodeToken = getInput('rqcode-token', { required: true })
    const token = getInput('token', { required: false })
    const label = getInput('label', { required: false })
    const stigs = getInput('stigs-comment', { required: false })
    const platform = sanitizeUrl(getInput('platform', { required: false }))

    // get repo context
    const repo = getRepo()

    // get issue context
    const issue = getIssue()
    console.log('Issue content: ', issue.content)

    const isSecurity = await Requirement.isSecurity(issue.content)
    if (isSecurity) await Requirement.setIssueLabel(repo, issue.number, label, token)

    // Run suggestion of STIGs and test cases if:
    // 1. User specified input STIGs as true
    // 2. ARQAN Classification Service encounters issue as security requirement
    if (stigs === 'true' && isSecurity) {
      const recommendedStigs = await Requirement.getStigs(issue.content, platform)
      if (recommendedStigs) {
        await Requirement.commentRecommendedStigs(recommendedStigs, repo, issue.number, token)

        // INTERACTION with RQCODE repository goes here
        await Rqcode.cloneRepo()
        const tests = await Rqcode.findTests(recommendedStigs)
        await Rqcode.commentFoundTests(tests.found, repo, issue.number, token)
        const openedIssues = await Rqcode.openIssues(tests.missing, rqcodeToken)
        await Rqcode.commentMissingTests(openedIssues, repo, issue.number, token)
      }
    }
  } catch (error: any) {
    setFailed(error.message)
  }
}

run()
