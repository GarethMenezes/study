# iBaguette Study Hub

Welcome to the repository for [study.ibaguette.com](https://study.ibaguette.com) - the *new and redesigned* study hub! 

This aims to be a full replacement for the legacy Cheat Sheets site, whilst allowing a huge amount of customisability and unified management of resources with more functionality built-in. 

## Pages & content

All the website's publically-accessible pages and source code is located in the `/static` directory. This is the root directory used for storing built HTML files and storing media - thus, the `index.html` in this directory is the page that shows when visiting `study.ibaguette.com`.

You will also find `/pages` which contains the source code, be it Markdown or HTML, used to build the pages you see on the website.

## Tech
- Next.js is used for the frontend. 
- To host the site, Cloudflare Pages is used.
- For accounts and auth, we use a custom server written in Python.
- For storing data and handling uploads, we use a Cloudflare R2 storage bucket and also use Cloudflare Workers.