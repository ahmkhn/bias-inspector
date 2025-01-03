# Academic Bias Inspector 
Academic Bias Inspector is a web application designed to help users identify and mitigate systemic biases in academic writing.  
Users upload a PDF or paste text and submit for analysis.  
All data remains confidential and is deleted after analysis.

# Example Results

Here's an example from a 15 page essay I wrote for my English Honors class on Data Privacy




https://github.com/user-attachments/assets/ef903254-5706-4867-9c3d-eecade0d9b62

# Tech Stack
Utilized Theo's <a href="https://create.t3.gg/" target="_blank">create-t3-app</a>  
Frontend: React.js, Next.js, TypeScript, TailwindCSS, ShadCN UI, Lucide React  
Backend: Next.js, UploadThing's AWS S3, PostgreSQL via Vercel Neon DB  
Authentication: Clerk  
Data Analytics: PostHog  
Error Management: Sentry  
Rate Limiting: Upstash  
Hosting: Vercel  

## TODO
1. Refactor file deletion code flow  
2. Add history of previous analysis extracted from analysis reports  
3. Add option to paste URL alongside current input options    
--4. Ratelimit the Analyze feature with Upstash before public production release--
5. Add users data alongside how many times they analyze onto Postgres  
6. Cleanup the PDF extraction and analysis component into seperate util files  
7. Find a solution for "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received" which exists only on old browsers  




## Installation

Clone the repo

```bash
  git clone https://github.com/ahmkhn/bias-inspector
  cd bias-inspector
  npm install
  npm run dev
```

Set up environment variables by creating a .env.local file in the root directory:


## Vercel Serverless DB 
DATABASE_URL = your_api_key  
DATABASE_URL_UNPOOLED =  your_api_key  
PGHOST =  your_api_key  
PGHOST_UNPOOLED =  your_api_key  
PGUSER =  your_api_key  
PGDATABASE =  your_api_key  
PGPASSWORD =  your_api_key  
POSTGRES_URL =  your_api_key  
POSTGRES_URL_NON_POOLING =  your_api_key  
POSTGRES_USER =  your_api_key  
POSTGRES_HOST =  your_api_key  
POSTGRES_PASSWORD =  your_api_key  
POSTGRES_DATABASE =  your_api_key  
POSTGRES_URL_NO_SSL =  your_api_key  
POSTGRES_PRISMA_URL =  your_api_key  

## Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  = your_api_key  
CLERK_SECRET_KEY = your_api_key  

## UploadThing AWS S3
UPLOADTHING_TOKEN = your_api_key  

## Sentry Error Management
SENTRY_AUTH_TOKEN = your_api_key  

## PostHog Data Analytics
NEXT_PUBLIC_POSTHOG_KEY  = your_api_key  
NEXT_PUBLIC_POSTHOG_HOST = your_api_key  

## Upstash Rate Limiting
UPSTASH_REDIS_REST_URL  = your_api_key  
UPSTASH_REDIS_REST_TOKEN = your_api_key   

## LLM
GPTKEY = your_api_key  

