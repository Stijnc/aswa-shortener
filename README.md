<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [asweb-shortener (Azure Static Web _app_ shortener)](#asweb-shortener-azure-static-web-_app_-shortener)
  - [The problem](#the-problem)
  - [This solution](#this-solution)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Shell Function](#shell-function)
    - [Shell Agnostic](#shell-agnostic)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# asweb-shortener (Azure Static Web _app_ shortener)

Uses Azure Static Web App's redirect functionality to make a personal URL
shortener. **It is heavily based on
[Netifly-URLShortener](https://github.com/kentcdodds/netlify-shortener)**

---

## The problem

You want a URL shortener for your custom domain and you want an easy way to
create and update URLs but you don't want to pay hundreds of dollars a year.

## This solution

This relies on
[Azure Static Web App](https://azure.microsoft.com/en-us/services/app-service/static/)
[`staticwebapp.config.json`](https://docs.microsoft.com/en-us/azure/static-web-apps/configuration)
file for building a super simple URL shortener where the URLs are managed on
GitHub and Azure Static Web App handles the redirecting for you.

The solution is heavily build upon
[netlify](https://github.com/kentcdodds/netlify-shortener) by
[Kent C. Dodds](https://github.com/kentcdodds).

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save asweb-shortener
```

## Usage

Your project should have a `staticwebapp.config.json` file that looks like this:

```json
// example
{
  "routes": [
    {
      "route": "/me",
      "redirect": "https://callebaut.io",
      "statusCode": "301"
    }
  ],
  "navigationFallback": {
    "rewrite": "index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "responseOverrides": {},
  "globalHeaders": {
    "content-security-policy": "default-src https: 'unsafe-eval' 'unsafe-inline'; object-src 'none'"
  }
}
```

This module exposes a binary that you should use in your `package.json` scripts.
You also need to add

- a `homepage` to your `package.json`
- a config setion to specify your appLocation (defaults to src)

```json
{
  "homepage": "https://stijn.run",
  "config": {
    "appLocation": "src"
  },
  "scripts": {
    "shorten": "asweb-shortener"
  }
}
```

Then you can run:

```
npm run shorten # simply formats your _redirects file
npm run shorten https://yahoo.com # generates a short code and adds it for you
npm run shorten https://github.com gh # adds gh as a short URL for you
```

The `asweb-shortener` does a few things:

1. generates a short code if one is not provided
2. validates your URL is a real URL
3. adds the URL to the `routes` section of `_redirects`
4. runs a git commit and push (this will trigger your Azure Static Web App CI/CD
   to deploy your new redirect)
5. Copies the short URL to your clipboard

This introduces some delay as the rebuild needs to be pushed.

<a name="bash-function"></a>

## Shell Function

If you want to be able to run this anywhere in the terminal, you can try making
a custom function for your shell.

### Shell Agnostic

1. Add the following [executable definition][npm-bin] to your `package.json`:
   ```json
   {"bin": {"shorten": "cli.js"}}
   ```
2. Create the `cli.js` file:
   ```js
   #!/usr/bin/env node
   require('asweb-shortener')
   ```
3. From your project directory, run the following to register the command
   globally:
   ```sh
   npm link
   ```
