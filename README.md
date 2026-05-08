# DoubtClear

DoubtClear is an AI-powered doubt-solving web app for school students. A student can choose their class and subject, type an academic question, and get a clear structured answer with an explanation, step-by-step solution, real-world analogy, concept name, and practice question.

The goal of this project is to make academic help simple, fast, and student-friendly.

---
## Screenshot
   <p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1Um2dbXSTSAzq4lV-m_CJc0fhSQcj1qkF" width="350"/>
  <img src="https://drive.google.com/uc?export=view&id=1ecLFq5tKyD6Be9OEeWhvWSzDFAi5XNIz" width="300"/>
</p>


## DeployLink
   LINK : https://doubt-solver-21.vercel.app/

## Features

- Select class level and subject
- Ask academic doubts in a simple text box
- Generate AI answers using Gemini
- Show answers in a student-friendly structure
- Include step-by-step explanations for math and science problems
- Provide a real-world analogy to make concepts easier to understand
- Add a practice question with hidden answer
- Handle short questions like "formula of cone"
- Clean formula formatting for readable answers

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Gemini API
- Vercel for deployment

## How It Works

1. The student selects their class and subject.
2. The student enters a doubt or question.
3. The app sends the question to the backend API route.
4. The backend calls the Gemini model with a tutor-style prompt.
5. The generated answer is streamed back and displayed in a clean format.

## Project Structure

```text
app/
  api/solve/route.ts    Backend API route for generating answers
  page.tsx              Main app page
components/             UI components
hooks/                  React hooks
lib/                    Prompts, constants, and shared types
public/                 Static assets
```

## Setup Locally

Clone the project and install dependencies:

```bash
npm install
```

Create a `.env.local` file in the root folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the development server:

```bash
npm run dev
```

On Windows PowerShell, if `npm run dev` is blocked by script policy, use:

```powershell
npm.cmd run dev
```

Open the app:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Deployment

This project can be deployed on Vercel.

Before deploying, add this environment variable in Vercel:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

After adding or changing environment variables, redeploy the project.

## Future Improvement

A useful improvement would be photo upload with OCR. Students could upload a photo of a textbook question or handwritten doubt. The app would extract the text from the image using OCR, then send the extracted question to Gemini for solving. This would make the app easier to use for students who do not want to type long questions.

## About

This project was built as a student-focused AI learning tool. It demonstrates frontend development, API integration, prompt design, and deployment using modern web technologies.
