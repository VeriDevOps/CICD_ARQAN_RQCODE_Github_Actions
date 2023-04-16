export interface Stig {
    id: string
    url: string
    platform: string
    title: string
    source: string
    description: string
    severity: string
}

export interface Test extends Stig {
    rqcode: string
}

export interface StigIssue extends Stig {
    issueUrl: string
}
