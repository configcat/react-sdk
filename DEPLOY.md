# How to deploy

## Before deployment

Make sure the CI is running: https://github.com/configcat/react-sdk/actions/workflows/react-ci.yml

## Steps to deploy manually

2.  Run tests

    ```bash
     npm test
    ```

3.  Create a new version (patch, minor, major)
    Increase version number by using `npm version patch | minor | major`

    _Example: increasing patch version_

    ```bash
    npm version patch
    ```

4.  Push tag to remote

    If you tag the commit, a GitHub action automatically publishes the package to NPM.

    ```bash
    git push origin <new version>
    ```

    _Example: git push origin v1.1.17_

    You can follow the build status here -> https://github.com/configcat/react-sdk/actions/workflows/react-ci.yml

5.  Make sure new package is available via NPM: https://www.npmjs.com/package/configcat-react

6.  Add release notes: https://github.com/configcat/react-sdk/releases

7.  Update `configcat-react` dependency in all sample applications:
    And test them by following their `README.md`.
