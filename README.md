# SimVoice

![SimVoice Logo](https://via.placeholder.com/150?text=SimVoice+Logo)

**SimVoice** is a modern invoicing application built with **Next.js**, **Firebase**, and **TypeScript**. It allows users to create, manage, and track invoices securely, with a seamless authentication system and protected routes to ensure a robust user experience. Whether you're a freelancer or a small business owner, SimVoice simplifies your invoicing needs with an intuitive interface and reliable backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Usage](#usage)
  - [Authentication](#authentication)
  - [Protected Routes](#protected-routes)
  - [Invoicing](#invoicing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Secure Authentication**:
  - Email/password sign-up and sign-in.
  - Google OAuth integration.
  - Password reset via email.
- **Protected Routes**:
  - `/account`: Accessible only to signed-in users; redirects non-signed-in users to `/sign-in`.
  - `/sign-in` and `/sign-up`: Accessible only to non-signed-in users; redirects signed-in users to `/`.
- **Invoicing**:
  - Create and manage invoices (stored in Firestore).
  - User-specific data isolation for security.
- **Responsive Design**:
  - Built with Tailwind CSS for a mobile-friendly UI.
- **State Management**:
  - Zustand for lightweight, performant state handling.
- **Type Safety**:
  - TypeScript for robust code and better developer experience.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: Zustand
- **Routing**: Next.js Middleware for protected routes
- **Build Tool**: Node.js, npm

## Getting Started

Follow these steps to set up and run SimVoice locally.

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Firebase Account**: Create a project in the [Firebase Console](https://console.firebase.google.com/).
- **Git**: To clone the repository

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/teajhaney/simvoice.git
   cd simvoice
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-msg-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Running the App

To run the app in development mode:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### Authentication

- Users can sign up, sign in, and reset their passwords using Firebase Authentication.

### Invoicing

- Authenticated users can:
  - Create invoices with dynamic line items, shipping, tax, discounts, etc.
  - Download invoices as PDFs using `html2canvas` and `jsPDF`.
  - Store invoices in Firestore and fetch/update them in real-time.

---

## Contact

Built by [@teajhaney](https://github.com/teajhaney) — feel free to reach out for feedback, ideas, or collaboration.
