import {getInput, setFailed} from '@actions/core'
import {sanitizeUrl} from "@braintree/sanitize-url";
import {getIssue, getRepo} from './github'
import Requirement from './requirement'
import Rqcode from './rqcode'
import ApiService from "./apiService";

async function run(): Promise<void> {
    try {
        // get inputs of the action
        const rqcodeToken = getInput('rqcode-token', {required: true})
        const token = getInput('token', {required: false})
        const label = getInput('label', {required: false})
        const stigs = getInput('stigs-comment', {required: false})
        const tests = getInput('search-tests', {required: false})
        const issues = getInput('create-issues', {required: false})
        const platform = sanitizeUrl(getInput('platform', {required: false}))
        const username = getInput('username', {required: true})
        const password = getInput('password', {required: true})
        const limit = parseInt(getInput('limit', {required: false}))
        const api_url = getInput('api_url', {required: false})

        // get repo context
        const repo = getRepo()

        // get issue context
        const issue = getIssue()

        const arqan_token = await ApiService.getToken(api_url, username, password)

        const isSecurity = await Requirement.isSecurity(api_url, issue.content, arqan_token)
        await Requirement.setIssueLabel(repo, issue.number, label, token, isSecurity)

        // Run suggestion of STIGs and test cases if:
        // 1. User specified input STIGs as true
        // 2. ARQAN Classification Service encounters issue as security requirement
        if (stigs === 'true' && isSecurity) {
            const recommendedStigs = await Requirement.getStigs(api_url, issue.content, platform, limit, arqan_token)
            if (recommendedStigs) {
                await Requirement.commentRecommendedStigs(recommendedStigs, repo, issue.number, token)

                // INTERACTION with RQCODE repository goes here
                if (tests === 'true') {
                    await Rqcode.cloneRepo()
                    const tests = await Rqcode.findTests(recommendedStigs)
                    await Rqcode.commentFoundTests(tests.found, repo, issue.number, token)

                    if (issues === 'true') {
                        const openedIssues = await Rqcode.openIssues(tests.missing, rqcodeToken)
                        await Rqcode.commentMissingTests(openedIssues, repo, issue.number, token)
                    }
                }
            }
        }
    } catch (error: any) {
        setFailed(error.message)
    }
}

run()
