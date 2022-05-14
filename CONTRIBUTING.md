# Contributing

Hi there! We are thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.
The following is a set of guidelines for contributing to [Security Requirement Analysis GitHub Action](https://github.com/VeriDevOps/security-requirement-analysis) which is hosted in the [VeriDevOps Organization on GitHub](https://github.com/VeriDevOps).

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[How Can I Contribute?](#how-can-i-contribute)

- [Reporting and Fixing Bugs](#reporting-and-fixing-bugs)
- [New Features](#new-features)
- [Submitting a Pull Request](#submitting-a-pull-request)

[Additional Notes](#additional-notes)

- [Issue and Pull Request Labels](#issue-and-pull-request-labels)

## Code of Conduct

This project and everyone participating in it is governed by the [Security Requirement Analysis GitHub Action Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms. Please report unacceptable behavior to [r.talalaeva@innopolis.university](mailto:r.talalaeva@innopolis.university).

## How Can I Contribute?

### Reporting and Fixing Bugs

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/VeriDevOps/security-requirement-analysis/issues?q=is%3Aopen+is%3Aissue+label%3Abug).

- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/VeriDevOps/security-requirement-analysis/issues/new/choose) and choose `Bug report` type. Be sure to include a **title and clear description**, as much relevant information as possible, and a **workflow code sample** or an **executable test case** demonstrating the expected and actual behavior.

- Fix bug and [submit a PR](#submitting-a-pull-request).

### New Features

1. Suggest your change via [opening a new issue](https://github.com/VeriDevOps/security-requirement-analysis/issues/new/choose) and choose `Feature request` type.

2. Implement a new feature and [submit a PR](#submitting-a-pull-request), after acceptance through Issue.

### Submitting a Pull Request

1. [Fork](https://github.com/VeriDevOps/security-requirement-analysis/fork) and clone the repository.
2. Configure and install the dependencies:
   1. In the project we use **Node v16.14.0** with **npm v8.3.1**. Use [nvm tool](https://github.com/nvm-sh/nvm) to easily control different versions of Node. Or install [manually](https://nodejs.org/en/download/releases/).
   2. Install dependencies via: `npm install`.
3. Make your change, build with `npm run prettier && npm run build`.
4. Push to your fork and [submit a pull request](https://github.com/veridevops/security-requirement-analysis/compare). Ensure the PR description clearly describes the problem/new feature and solution. Include the relevant issue number if applicable.
5. Wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Keep your change as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

#### Type of Issue and Issue State

| Label name         | `Hydrospheredata/hydro-monitoring` :mag_right:                                                                                            | Description                                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enhancement`      | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Aenhancement)          | Feature requests.                                                                                                                                |
| `bug`              | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Abug)                  | Confirmed bugs or reports that are very likely to be bugs.                                                                                       |
| `good first issue` | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Agood%20first%20issue) | Less complex issues which would be good first issues to work on for users who want to contribute to Security Requirement Analysis GitHub Action. |
| `question`         | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Aquestion)             | Questions more than bug reports or feature requests (e.g. how do I do X).                                                                        |
| `help wanted`      | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Ahelp%20wanted)        | The VeriDevOps core team would appreciate help from the community in resolving these issues.                                                     |
| `duplicate`        | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Aduplicate)            | Issues which are duplicates of other issues, i.e. they have been reported before.                                                                |
| `wontfix`          | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Awontfix)              | The VeriDevOps core team has decided not to fix these issues for now, either because they're working as intended or for some other reason.       |
| `dependencies`     | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Adependencies)         | Label for dependabot Pull Requests or for users updates on dependencies.                                                                         |
| `security`         | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Asecurity)             | Label for classifying Issues that are Security Requirements.                                                                                     |
| `testing`          | [search](https://github.com/search?q=is%3Aopen+is%3Aissue+repo%3AVeriDevOps%2Fsecurity-requirement-analysis+label%3Atesting)              | Label used for classifying Issues that are opened for the test purposes.                                                                         |

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)
