import { context } from '@actions/github'

function getIssueNumber(): number | undefined {
  const issue = context.payload.issue
  if (!issue) {
    return
  }

  return issue.number
}

function getIssueTitle(): string | undefined {
  const issue = context.payload.issue
  if (!issue) {
    return
  }
  return issue.title
}

function getIssueBody(): string | undefined {
  const issue = context.payload.issue
  if (!issue) {
    return
  }

  return issue.body
}

export const getIssue = (): { number: number; content: string } => {
  const number = getIssueNumber()
  const title = getIssueTitle()
  const body = getIssueBody()

  // check whether issue exists
  if (number === undefined) throw new Error('Could not get issue number')
  if (title == undefined) throw new Error('Could not get issue title')

  // construct issue content from title and body
  const content = title == null ? (body == null ? '' : body) : body == null ? title : `${title} ${body}`
  return { number, content }
}

export const getRepo = (): { owner: string; repo: string } => {
  return context.repo
}
