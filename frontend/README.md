# 🎨 Premium RBAC Frontend

A beautiful, modern, and fully responsive Role-Based Access Control system built with React, Tailwind CSS, and Framer Motion.

## ✨ Features

### 🎨 Design
- **Glass-morphism UI** - Frosted glass effects throughout
- **Premium Color Palette** - Professional color scheme
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Design** - Works perfectly on all devices

### 🔐 Authentication
- Secure login/register with Laravel Sanctum
- Session management
- Protected routes
- Permission-based access control

### 📊 Dashboard
- Real-time statistics
- Beautiful gradient cards
- Activity timeline
- Quick actions

### 👥 User Management
- List, create, edit, delete users
- Role assignment
- Permission management
- Advanced filtering

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Tech Stack

- **React** 18.2.0
- **Tailwind CSS** 4.x
- **Framer Motion** 12.x
- **React Router** 7.x
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Lucide React** - Icons

## 🎯 Premium Features

### Glass-Morphism Cards
```jsx
<div className="glass-card p-6 rounded-2xl">
  Beautiful frosted glass effect
</div>
```

### Gradient Buttons
```jsx
<button className="btn-premium">
  Premium Button
</button>
```

### Animated Backgrounds
- Blob animations
- Gradient mesh
- Floating elements

## 🎨 Color Scheme

- **Primary**: Sky Blue (#0ea5e9)
- **Secondary**: Purple (#d946ef)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

## 📱 Responsive Design

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Configuration

### API Base URL
Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Customize Colors
Edit `tailwind.config.js` > `colors` section

## 📚 Documentation

- **Installation Guide**: See `INSTALLATION_GUIDE.md`
- **Component Examples**: Check pages folder
- **API Integration**: See `src/api` folder

## 🎭 Animations

- Fade in/out
- Slide animations
- Scale effects
- Shimmer loading
- Float effects
- Blob backgrounds

## 🐛 Troubleshooting

### Styles not working?
```bash
rm -rf node_modules/.vite
npm run dev
```

### Backend connection error?
Check `.env` file and ensure Laravel backend is running

## 📝 File Structure

```
src/
├── api/              # API integration
├── components/       # Reusable components
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── pages/            # Page components
├── store/            # State management
└── utils/            # Helper functions
```

## 🎉 Demo Credentials

```
Super Admin: superadmin@example.com / password
Manager:     manager@example.com / password
Viewer:      viewer@example.com / password
```

## 📄 License

MIT License

## 💝 Credits

Built with ❤️ for modern web applications

---

**Happy coding! 🚀**
