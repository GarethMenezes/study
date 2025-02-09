# iBaguette Study Hub

Welcome to the repository for [study.ibaguette.com](https://study.ibaguette.com) - the *new and redesigned* study hub! 

This aims to be a full replacement for the legacy Cheat Sheets site, whilst allowing a huge amount of customisability and unified management of resources with more functionality built-in. 

## Pages & content

All the website's publically-accessible pages and source code is located in the `/pages` directory. This is the root directory used for storing built HTML files and storing media -- thus, the `index.html` in this directory is the page that shows when visiting `study.ibaguette.com`.

You will also find `/pages-source` which contains the source code, be it Markdown or HTML, used to build the pages you see on the website.

## Tech
- To host the site, Cloudflare Pages is used.
- For accounts and auth, we use a custom server written in Python.
- For storing data and handling uploads, we use a Cloudflare R2 storage bucket and also use Cloudflare Workers.
- To generate the assets you see, we use Hugo.



## Why "study"?
The *stu-* prefix could be for *stu*dents and, more obviously, I wanted to choose something that's not just "revision" or "boringworktodo" - and study perfectly encapsulates this. Not necessarily the boring tasks of revision and revising for exams, but learning more in general. 

Why not "learn"? Learn means to comprehend and understand new content not previously taught. Studying would imply that you may have either learnt it beforehand or may be new to it - but either way, you want to understand the subject at hand in a more detailed manner. It also sounds better saying that you're *studying X* rather than *learning X*.