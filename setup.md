# Food Ordering System - Setup Guide

This guide will help you set up and run the Food Ordering System on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

## Quick Setup

### 1. Clone or Download the Project

If you have this as a local folder, you can skip this step.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001`

### 5. Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### 6. Open the Application

Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
food-ordering-system/
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── data/           # In-memory data storage
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.js
├── frontend/               # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (cart state)
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main app component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # TailwindCSS styles
│   ├── public/             # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
├── README.md
├── setup.md
└── .gitignore
```

## API Endpoints

### Menu Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/menu?category=appetizer` - Get menu items by category
- `GET /api/menu?vegetarian=true` - Get vegetarian menu items
- `GET /api/menu/categories` - Get all available categories
- `GET /api/menu/:id` - Get specific menu item

### Order Endpoints
- `POST /api/order` - Create a new order
- `GET /api/order/:id` - Get order details by ID
- `GET /api/order` - Get all orders (for admin)

### Health Check
- `GET /health` - Check if the API is running

## Features

### ✅ Implemented Features
- **Menu Browsing**: View all menu items with categories
- **Filtering**: Filter by category and vegetarian options
- **Shopping Cart**: Add/remove items with quantity management
- **Order Placement**: Complete checkout process with customer details
- **Order Confirmation**: Order summary with order ID
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Beautiful interface with TailwindCSS

### 🎯 Bonus Features (Ready for Extension)
- **Order History**: View past orders
- **User Authentication**: Login/signup system
- **Admin Panel**: Manage orders and menu items
- **Payment Integration**: Add payment processing
- **Real-time Updates**: WebSocket integration for order status

## Development Scripts

### Backend Scripts
```bash
cd backend
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint issues
```

### Frontend Scripts
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint issues
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `backend/src/index.ts` (line 9)
   - Frontend: Change port in `frontend/vite.config.ts` (line 6)

2. **CORS Errors**
   - Make sure backend is running on port 3001
   - Check CORS configuration in `backend/src/index.ts`

3. **API Connection Issues**
   - Verify backend is running: `http://localhost:3001/health`
   - Check API base URL in `frontend/src/services/api.ts`

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript configuration
   - Ensure all dependencies are installed

### Getting Help

If you encounter any issues:

1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure both backend and frontend are running
4. Check the network tab in browser dev tools for API errors

## Next Steps

Once you have the basic system running, you can:

1. **Add a Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Add Authentication**: Implement user login/signup
3. **Add Payment**: Integrate Stripe or PayPal
4. **Add Real-time Features**: Implement WebSocket for live order updates
5. **Add Admin Panel**: Create dashboard for restaurant management
6. **Add Mobile App**: Create React Native app
7. **Add Testing**: Implement unit and integration tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.
