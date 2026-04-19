# Portfolio + Resume Builder

A fully editable portfolio website with admin dashboard for managing content.

## Features

- **Admin Dashboard**: Edit profile, skills, projects, and resume sections.
- **Inline Editing**: Edit content directly on the website when logged in.
- **Drag & Drop Resume**: Rearrange resume sections with drag and drop.
- **PDF Export**: Download resume as PDF.
- **Real-time Updates**: Changes save automatically.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- Go to `/login`
- Email: `admin@example.com`
- Password: `password`

## Usage

- **Dashboard**: Access via `/dashboard` after login. Edit all content here.
- **Inline Editing**: When logged in, click on text elements on the main page to edit them.
- **Resume**: View at `/resume` and download PDF.

## Data Storage

Data is stored in `data.json` file. In production, consider using a database.