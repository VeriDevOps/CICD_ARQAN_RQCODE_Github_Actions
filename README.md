# Security Requirement Analysis GitHub Action

[![GitHub license](https://shields.io/badge/license-Apache%202-green?style=for-the-badge)](https://github.com/VeriDevOps/security-requirement-analysis/blob/main/LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](code_of_conduct.md)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

A GitHub Action to analyze your security requirements that are represented in the form of GitHub Issues. If Action classifies Issue as a security requirement, then it sets a label on it. Additionally, it recommends [Security Technical Implementation Guides(STIGs)](https://www.stigviewer.com) that cover the requirement. Moreover, it suggests already implemented tests on the recommended STIGs from [VDO-Patterns repository](https://github.com/anaumchev/VDO-Patterns). In case of tests absence on proposed STIGs, automatically creates Issue in [VDO-Patterns repository](https://github.com/anaumchev/VDO-Patterns) asking to implement it.

## Usage

You can use the Security Requirement Analysis GitHub Action in a [GitHub Actions Workflow](https://docs.github.com/en/actions/learn-github-actions) by configuring a YAML-based workflow file, e.g. `.github/workflows/security-requirement.yaml`, with the following:

```yaml
name: Analyse security requirement

on:
  # triggers on Issue opened event
  issues:
    types:
      - opened

jobs:
  label:
    runs-on: ubuntu-latest
    name: Find out if Issue is security requirement
    steps:
      - uses: actions/checkout@v3
      - uses: VeriDevOps/security-issue-classification@main
        name: Label an issue, suggest STIGs and Tests
        with:
          rqcode-token: ${{ secrets.RQCODE_TOKEN }}
```

## Inputs

### `rqcode-token`

**Required.** A GitHub access token (PAT) with public_repo access in the repo scope. **NOTE.** The automatically provided token e.g. `${{ secrets.GITHUB_TOKEN }}` can not be used, GitHub prevents this token from being able to create issues in other repositories(in our case, [VDO-Patterns repository](https://github.com/anaumchev/VDO-Patterns)). [The reasons are explained in the GitHub Community Forum](https://github.community/t/what-permission-level-do-i-need-to-create-issues-using-pat/124769).

The solution is to [manually create a PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) and [store it as a secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) e.g. `${{ secrets.RQCODE_TOKEN }}`

### `label`

**Optional.** The label to mark issue as security requirement. **Default**: `'security'`

### `stigs-comment`

**Optional.** Enable STIGs and tests suggestion from [VDO-Patterns repository](https://github.com/anaumchev/VDO-Patterns) through issue commenting. **Default**: `'true'`

### `token`

**Optional.** A github token used for creating an octoclient for making API calls for labeling and commenting Issues. If you want to use another user, you can specify its token. **Default**: `${{ github.token }}`

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for step-by-step instructions.

If you need help or have a question, let us know via a [GitHub issue](https://github.com/VeriDevOps/security-requirement-analysis/issues/new/choose) with type `Question`.

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/VeriDevOps/security-requirement-analysis/blob/main/LICENSE) file for details.
