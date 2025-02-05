# study
Source file tree for study.ibaguette.com







# Backend

## Components - The Stack

- Static files created with some sort of library (React/nextjs/Hugo??) so no need for server
- Dynamic components e.g. sign into account to upload integrates with ibaguette database 
- Cloudflare Workers handle input/user queries etc. - e.g. search DB, upload
- Database: SQLite on the edge with Cloudflare D1: https://developers.cloudflare.com/d1/platform/pricing/
- Storage: R2 bucket
