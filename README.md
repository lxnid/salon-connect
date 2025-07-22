# SalonConnect 💄

A social platform for beauty and salon services that connects customers with the best salons and stylists near them.

## Features ✨

- **Location-based Search**: Find salons and barbers nearby using GPS
- **Personalized Recommendations**: AI-powered suggestions based on preferences and history
- **Easy Booking**: Multi-step booking process with service, stylist, and time selection
- **Social Features**: Reviews, ratings, favorites, and booking history
- **Role-based System**: Separate interfaces for customers, salon owners, and stylists
- **AI Assistant**: Hands-free search and booking with natural language

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: Cloudinary for images
- **Deployment**: Docker containers on Render (free tier)

## Project Structure 📁

```
salon-connect/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express.js backend
├── packages/
│   ├── database/         # Prisma schema & client
│   ├── types/           # Shared TypeScript types
│   └── ui/              # Shared UI components
├── docker-compose.yml   # Local development
├── Dockerfile          # Production deployment
└── render.yaml         # Render deployment config
```

## 🌐 Live Demo

**🎉 SalonConnect is now live and functional!**

- **Frontend**: [GitHub Pages URL] (deployed via GitHub Actions)
- **API**: https://salon-connect-api.onrender.com/api
- **Health Check**: https://salon-connect-api.onrender.com/health

### ✨ Current Features:
- ✅ **Dynamic Salon Search** - Fetches real data from deployed API
- ✅ **Loading States** - Proper UX with loading indicators
- ✅ **Error Handling** - Graceful fallbacks and retry options
- ✅ **User Authentication** - Login/signup with JWT tokens
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Search Functionality** - Real-time search with API integration

### 🧪 Test Accounts:
- **Customer**: `customer@example.com` / `password123`
- **Salon Owner**: `owner@example.com` / `password123`  
- **Stylist**: `sarah@example.com` / `password123`

## Getting Started 🚀

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (provided by Render)

### Development Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repo-url>
   cd salon-connect
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp apps/api/.env.example apps/api/.env
   # Edit the .env file with your database URL and other secrets
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000/api
   - Health check: http://localhost:5000/health

### Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio --workspace=packages/database

# Seed database
npm run db:seed --workspace=packages/database
```

### Available Scripts

```bash
# Development
npm run dev                    # Start both frontend and backend
npm run dev --workspace=apps/web   # Start only frontend
npm run dev --workspace=apps/api   # Start only backend

# Building
npm run build                  # Build both apps
npm run start                  # Start production server

# Database
npm run db:generate           # Generate Prisma client
npm run db:push              # Push schema to database
npm run db:migrate           # Create and run migrations

# Code quality
npm run lint                 # Lint all workspaces
npm run type-check          # TypeScript type checking
```

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (authenticated)

### Salons
- `GET /api/salons` - Search salons with filters
- `GET /api/salons/:id` - Get salon details

### Coming Soon
- Booking management endpoints
- Review and rating endpoints
- AI assistant endpoints
- User management endpoints

## Deployment 🚀

### Render (Free Tier)

1. **Push your code to GitHub**

2. **Deploy using render.yaml**:
   - Connect your GitHub repository to Render
   - The `render.yaml` file will automatically configure:
     - PostgreSQL database
     - API web service
     - Frontend static site

3. **Set environment variables** in Render dashboard:
   - `DATABASE_URL` (auto-generated)
   - `JWT_SECRET` (generate a strong secret)
   - `CLOUDINARY_*` (for image uploads)

### Local Docker Production

```bash
# Build production image
docker build -t salon-connect .

# Run with environment variables
docker run -p 5000:5000 --env-file apps/api/.env salon-connect
```

## Development Roadmap 🗺️

### Phase 1: MVP Core ✅
- [x] Project setup and infrastructure
- [x] User authentication system
- [x] Basic salon search and listings
- [x] Database schema and API endpoints
- [ ] Core booking flow
- [ ] Basic responsive UI

### Phase 2: Enhanced Experience
- [ ] Advanced search filters
- [ ] Review and rating system
- [ ] User dashboards and booking history
- [ ] Email notifications
- [ ] Mobile optimization

### Phase 3: Business Intelligence
- [ ] Salon owner dashboard with analytics
- [ ] Advanced schedule management
- [ ] Customer insights and revenue tracking
- [ ] Gallery/portfolio features

### Phase 4: AI Integration
- [ ] AI assistant for search and booking
- [ ] Personalized recommendations
- [ ] Behavior pattern analysis
- [ ] Automated service provider categorization

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

For questions or support, please open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com).

---

Made with ❤️ for the beauty industry