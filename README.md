# Highlight new NPM dependencies in Pull Requests

In Pull Requests, this action highlight the addition of new NPM dependencies in
one of the `package.json` of your repository.

Adding new dependencies in a project should never be a small change, and often
it should trigger discussions between maintainers. This action can help you
making sure that you are not missing the addition of new package in your NPM
`dependencies` and `devDependencies`.

To highlight new packages, this action compares the list of dependencies 
registered in the current branch with the ones registered in the base branch.
This check only occurs for each `package.json` file added or updated with the
current pull request.

This action is not only looking at the root-level `package.json` but potentially
any existing `package.json` in the project to be compatible with monorepo 
projects.

## Usage

This _GitHub Action_ should run everytime a commit is pushed to the pull request
to check any potential addition or change in one of your `package.json`.

```yml
name: Inspect dependencies
on:
  - pull_request

jobs:
  check_new_dependencies:
    runs-on: ubuntu-latest
    steps:
      - name: Check for new dependencies
        uses: hiwelo/new-dependencies-action@1.0.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

```

### Build

Build the typescript and package it for distribution

```
$ npm run build && npm run pack
```

## Example

![Message generated by the GitHub Action showing a list of new dependencies with a table showing some information like author, description and date of the last update for each dependency](https://raw.githubusercontent.com/hiwelo/new-dependencies-action/stable/docs/images/message.png)

## License

This project is released under the MIT License.
