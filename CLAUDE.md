# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build static site for production (generates `out/` directory)
- `npm run lint` - Run ESLint to check code quality
- `npm start` - Start production server

## Architecture Overview

This is a **Next.js academic profile website** configured for static export to GitHub Pages. The site is structured as a personal academic portfolio with the following key characteristics:

### Data-Driven Content System
- **Publications**: Stored in `data/publications.toml` using TOML format with structured metadata (title, authors, year, venue, type, DOI/URL)
- **News/Updates**: Stored in `data/news.md` using frontmatter format with date, title, type (publication/talk/award/event), and content
- **Content Types**: Defined in `src/types/index.ts` with both runtime and serializable versions for Next.js server-to-client data transfer

### Component Architecture
- **Layout**: Single-page layout with Header → Profile → News → Publications → Footer sections
- **Server Components**: Publications and News components are async server components that read data files at build time
- **Client Components**: PublicationsList and NewsList handle rendering and filtering of data arrays
- **Styling**: Uses Tailwind CSS with dark mode support

### Static Site Generation
- **Configuration**: `next.config.ts` configured with `output: 'export'` and `images: { unoptimized: true }` for GitHub Pages compatibility
- **Build Output**: Generates static files in `out/` directory ready for deployment
- **No Server Dependencies**: All data is processed at build time, no runtime server required

### Data Management Tools
- **Publication Updater**: `src/scripts/update_publications.py` automatically fetches and parses publications from DBLP, converts to TOML format
- **Manual Updates**: News items and profile information require manual editing of data files

### Key Dependencies
- `@iarna/toml` - TOML parsing for publications data
- `gray-matter` - Frontmatter parsing for news/markdown content
- Geist fonts loaded locally for typography consistency

When making changes, always consider the static generation workflow and ensure data files maintain their expected structure for proper parsing by the respective components.