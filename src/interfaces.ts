export interface Stig {
  id: string
  url: string
}

export interface Test extends Stig {
  rqcode: string
}

export interface StigIssue extends Stig {
  issueUrl: string
}
