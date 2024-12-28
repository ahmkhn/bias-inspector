# Academic Bias Inspector 
Academic Bias Inspector is a web application designed to help users identify and mitigate systemic biases in academic writing.  
Users upload a PDF or paste text and submit for analysis.  
All data remains confidential and is deleted after analysis.

# Example Results

Here's an example from a 15 page essay I wrote for my English Honors class on Data Privacy


<img width="1319" alt="image" src="https://github.com/user-attachments/assets/d251a5f7-b2ba-464a-8f6a-afb51fd38261" />

<img width="1296" alt="image" src="https://github.com/user-attachments/assets/b417b9f5-b04a-41d7-ae5c-3e721e8454af" />

<img width="1292" alt="image" src="https://github.com/user-attachments/assets/fbee8edd-a096-4efd-a9c6-9913f21e803d" />

<img width="1305" alt="image" src="https://github.com/user-attachments/assets/abdd8038-1807-4d9a-80da-d8230e8dba74" />

# Tech Stack
Utilized Theo's <a href="https://create.t3.gg/" target="_blank">create-t3-app</a>  
Frontend: React.js, Next.js, TypeScript, TailwindCSS, ShadCN UI, Lucide React  
Backend: Next.js, UploadThing's AWS S3, PostgreSQL via Vercel Neon DB  
Authentication: Clerk  
Data Analytics: PostHog  
Error Management: Sentry  
Rate Limiting: Upstash  
Hosting: Vercel  


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

