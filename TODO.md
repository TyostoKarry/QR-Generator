# TODO List

## MVP Features

- [x] **Text Input**: User enters a link or text directly.
- [x] **QR Code Generation**: Display QR code using text/links as input.
- [x] **URL Detection**: Extract URLs using regex or other filters.
- [x] **Drag-and-Drop Area**: Accepts various file types (PDF, image).
- [x] **Logo Overlay in QR**: Embed a small image/logo in the center of the QR code.
- [x] **QR code colors**: Allow users to customize the foreground and background colors of the QR code.
- [x] **Error Correction Handling**: Adjust error correction levels based on whether a logo is used.
- [x] **Share Functionality**: Copy QR codes to clipboard or download QR images.
- [ ] Supabase Storage: Configure Supabase Storage to securely store uploaded files (images and PDFs). Generate public URLs for these files to embed in QR codes. Set up storage rules to enforce file size limits (max 10MB) and restrict uploads to authenticated users.
- [x] Supabase Authentication: Enable user login (e.g., email/password, Google) to restrict file-related QR code generation to logged-in users.
- [ ] Rate Limit: Track and enforce rate limiting (max 3 file-related QR codes per hour per user) using Supabase's database and row-level security (RLS) policies.
- [x] Connect Supabase to Frontend: Integrate Supabase SDK into the frontend to handle file uploads, authentication, and database operations directly from the React app.
- [ ] **Deploy Demo**: Publish demo version of the end product via GitHub pages (Only frontend).
- [ ] **Documentation**: Write a README.md file to explain the app's features, setup instructions, and usage guidelines.
