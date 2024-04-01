# Passwordless Authentication (work in progress)

This passwordless authentication app is built on Next.js, utilizing NodeMailer for one-time password (OTP) verification. It offers a secure, user-friendly authentication method without traditional passwords.

Specifically, this app leverages Next.js server actions, enabling direct server-side function calls from the client, simplifying the architecture by eliminating the need for separate API route handlers. The app employs `pnpm` for package management, enhancing performance and efficiency.

## Features

- **Passwordless Authentication**: Streamlines the login process through OTPs sent via email.
- **Secure**: Employs HTTPS locally with Next.js's `mkcert` for development, ensuring data encryption.
- **Next.js Server Actions**: Uses server actions for a more streamlined and potentially secure authentication process, as it reduces the surface area for attacks that might target separate API endpoints.
- **Efficient Package Management**: Utilizes `pnpm` for faster, more efficient node module management.

## Prerequisites

Ensure you have the following installed before starting:

- [Node.js](https://nodejs.org/en/) (LTS version recommended)
- [pnpm](https://pnpm.io/installation) (See installation guide)

## Setup

1. **Clone the Repository**

   Clone the project using SSH:

   ```bash
   git clone git@github.com:scottjason/passwordless-authentication.git
   cd passwordless-authentication
   ```

2. **Install Dependencies**

   Install the necessary dependencies with `pnpm`:

   ```bash
   pnpm install
   ```

3. **Environment Variables**

   Duplicate the `.env.local.example` file, rename it to `.env.local`, and fill in your SMTP settings:

   ```plaintext
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   FROM_MAIL=your_from_email_address
   ```

   These are essential for configuring NodeMailer to send OTP emails.

## Running the App

- To run the development server with HTTPS (utilizing Next.js's `mkcert`):

  ```bash
  pnpm dev
  ```

  This command starts the app on a secure HTTPS connection locally. You can then open your browser and navigate to https://localhost:3000 to run the app. The first time you access the app, you may need to accept the self-signed certificate in your browser.

## Notes

- **HTTPS in Development**: The app runs over HTTPS in development mode thanks to Next.js's automatic certificate generation with `mkcert`, providing a secure environment that closely resembles a production setup.
- **Email Delivery**: Make sure your SMTP service provider permits sending emails with the provided SMTP settings. Adjustments or App Passwords might be required based on your provider's security policies.
