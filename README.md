This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy to GitHub Pages

To deploy this site as your main GitHub Pages site (https://username.github.io), follow these steps:

### Repository Setup

1. **Create Special Repository**
   - Create a new repository named exactly `username.github.io` (replace `username` with your GitHub username)
   - For example, if your username is "john", the repository should be named "john.github.io"

2. **Configure Next.js for Static Export**

   Update `next.config.ts`:
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     }
   };
   ```

### Method 1: Manual Deployment

1. **Build the Project**
   ```bash
   # Install dependencies if you haven't already
   npm install

   # Build the project
   npm run build
   ```
   This will create an `out` directory with the static files.

2. **Deploy to GitHub Pages**
   ```bash
   # Initialize a new git repository in the out directory
   cd out
   git init
   git add -A
   git commit -m "Deploy to GitHub Pages"

   # Push to the gh-pages branch
   git push -f git@github.com:username/username.github.io.git main:gh-pages
   ```
   Replace `username` with your GitHub username.

3. **Configure GitHub Pages**
   
   a. Go to your repository's Settings
   b. Navigate to Pages section
   c. Under "Build and deployment":
      - Source: Deploy from a branch
      - Branch: gh-pages
   d. Save the settings

### Method 2: Automated Deployment (GitHub Actions)

1. **Create GitHub Actions Workflow**

   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: ["main"]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./out

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

2. **Configure GitHub Repository**

   a. Go to your repository's Settings
   b. Navigate to Pages section
   c. Under "Build and deployment":
      - Source: Select "GitHub Actions"
   d. Save the settings

3. **Update package.json**

   Add the build script:
   ```json
   {
     "scripts": {
       "build": "next build"
     }
   }
   ```

4. **Deploy**

   Simply push your changes to the main branch:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push origin main
   ```

   The GitHub Actions workflow will automatically build and deploy your site.

Your site will be available at: `https://username.github.io` (replace `username` with your GitHub username)

### Important Notes

1. Make sure your repository is named exactly `username.github.io`
2. Only one site per GitHub account can be hosted at the root domain
3. The site will be accessible at `https://username.github.io` without any subdirectory

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
