# 🚀 LibreMedic Frontend

**LibreMedic** is a modern, full-featured medical management system. This frontend application provides a clean, responsive, and intuitive interface for managing clinics, hospitals, and medical offices.

---

## 📋 Project Overview

Built with cutting-edge technologies like **Next.js 15**, **TypeScript**, and **Tailwind CSS**, LibreMedic enables seamless management of patients, doctors, appointments, diagnoses, and prescriptions.

---

## ✨ Key Features

### 🏥 Patient Management
- Full registration: personal, contact, and medical info
- Medical history: allergies, background, clinical data
- Advanced search: name, email, phone filters
- Full CRUD operations

### 👨‍⚕️ Doctor Management
- Professional profiles
- Specialty assignment
- Secure user authentication

### 🏢 Medical Centers
- Institutional data
- Resource & capacity management
- Location and contact info

### 📅 Appointment System
- Smart scheduling
- Appointment statuses: Scheduled, Confirmed, In Progress, Completed, Cancelled
- Auto-assignment: patient–doctor–center
- Email/Toast notifications

### 🔬 Diagnoses
- Clinical logs: symptoms, diagnosis, treatment
- Severity & status classification
- Follow-ups and history tracking

### 💊 Prescriptions
- Medication records
- Dosage instructions
- Validity control
- Statuses: Active, Expiring, Expired

---

## 🛠️ Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Sonner Toasts](https://sonner.emilkowal.dev/)

### State & Data
- React Hooks (useState, useEffect, use)
- Fetch API for backend communication
- TypeScript interfaces for strong typing

### Dev Tools
- [pnpm](https://pnpm.io/) – blazing fast package manager
- ESLint + Prettier for code quality

---

## 📁 Project Structure

libremedicfront/
├── app/ # Next.js App Router
│ ├── patients/
│ ├── users/
│ ├── medical-centers/
│ ├── appointments/
│ ├── diagnoses/
│ └── prescriptions/
├── components/
│ ├── ui/ # shadcn UI components
│ ├── app-sidebar.tsx
│ └── form-field-wrapper.tsx
├── lib/
│ ├── api.ts # API client
│ ├── utils.ts
│ └── validation.ts
├── hooks/
│ └── use-form-validation.ts
└── public/ # Static files

---

## 🔧 API Configuration

The app connects to a backend via `lib/api.ts`. Main endpoints:
/patients
/users
/medical-centers
/appointments
/diagnostics
/prescriptions


Update your `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
🚀 Getting Started
Prerequisites
Node.js 18+

pnpm (recommended) or npm

LibreMedic backend running at localhost:5001

Installation


# 1. Clone the repo
git clone <repository-url>
cd libremedicfront

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# 4. Run development server
pnpm dev
🎨 UI/UX Highlights
Responsive Design – Mobile-first, adaptive layout

Modern Components – Sidebar, Cards, Tables, Forms, Modals

UI States – Loading, Error, Empty, Success

🔐 Authentication & Security
JWT-based authentication

Protected routes

Role-based access control

Secure session management

📊 Advanced Features
Global Search & Filters

Interactive Dashboards

PDF/Excel Reports

Print-Friendly Views

🧪 Testing

# Run tests
pnpm dev

# Integration tests
pnpm test:integration

# Test coverage
pnpm test:coverage
🐳 Docker Support
dockerfile
Copy
Edit
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]


🌍 Deployment
Production Build
bash
Copy
Edit
pnpm build
pnpm start

🤝 Contributing
Fork the project

Create a branch (git checkout -b feature/YourFeature)

Commit your changes

Push to your branch

Open a Pull Request

## 📝 License

This project is licensed under the **GNU GPL v3** License - see the [LICENSE](LICENSE) file for details.

By using, modifying or distributing this software, you agree to the terms of the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html).
