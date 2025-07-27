# TechGear Pro Admin Portal

A modern React-based e-commerce admin portal with dark/light theme support, built for managing technology products and accessories.

## 🚀 Features

### Core Functionality
- **Dashboard**: Overview with store statistics and featured products
- **Product Management**: Full CRUD operations for products
- **Search & Filtering**: Dynamic search with category, price range, and featured filters
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Theme**: Toggle between themes with persistent preferences

### Technical Features
- **React 18** with JavaScript
- **React Router** for client-side routing
- **Custom Hooks** for API management
- **Context API** for theme management
- **JSON Server** for mock backend
- **Modern CSS** with CSS variables for theming

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript, React Router DOM
- **Styling**: CSS3 with CSS Variables
- **Backend**: JSON Server (mock API)
- **State Management**: React Hooks (useState, useContext, useEffect)
- **Testing**: Jest, React Testing Library

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server (Backend)**
   ```bash
   npm run server
   ```
   This will start the mock API server on `http://localhost:3001`

4. **Start the React Development Server**
   ```bash
   npm start
   ```
   This will start the React app on `http://localhost:3000`

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.jsx   # Navigation bar with theme toggle
│   ├── Dashboard.jsx    # Landing page with stats
│   ├── Products.jsx     # Product management with search
│   └── AddProduct.jsx   # Product creation form
├── contexts/            # React contexts
│   └── ThemeContext.js  # Theme management
├── hooks/               # Custom hooks
│   └── useApi.js        # API management hook
├── styles/              # Styling
│   └── global.css       # Global styles and theme variables
└── App.jsx              # Main application component
```

## 🎨 Theme System

The application features a comprehensive theme system with:

- **Dark Theme**: Default theme with dark backgrounds and light text
- **Light Theme**: Alternative theme with light backgrounds and dark text
- **Persistent Storage**: Theme preference saved in localStorage
- **Smooth Transitions**: CSS transitions for theme switching

### Theme Variables
- Background colors (primary, secondary, tertiary)
- Text colors (primary, secondary)
- Accent colors
- Border colors
- Shadow effects

## 🔧 API Endpoints

The application uses JSON Server with the following endpoints:

- `GET /products` - Get all products
- `GET /products/:id` - Get specific product
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /store_info` - Get store information

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Adaptive navigation
- Touch-friendly interfaces

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📦 Build for Production

```bash
npm run build
```

## 🎯 Key Features Explained

### 1. Dashboard
- Store statistics overview
- Featured products display
- Quick navigation to key functions
- Store information display

### 2. Product Management
- View all products in a grid layout
- Search by name or description
- Filter by category, price range, and featured status
- Inline editing capabilities
- Delete confirmation

### 3. Add Product
- Comprehensive form with validation
- Real-time preview
- Image URL validation
- Category management
- Featured product toggle

### 4. Search & Filtering
- Real-time search functionality
- Multiple filter options
- Dynamic result count
- Responsive filter interface

## 🔒 Data Persistence

- Products and store information stored in `db.json`
- Theme preferences saved in localStorage
- Form data validation before submission

## 🎨 Customization

### Adding New Categories
Categories are automatically generated from existing products. To add a new category:
1. Go to Add Product page
2. Select "+ Add New Category" from the dropdown
3. Enter the new category name

### Modifying Theme Colors
Edit the CSS variables in `src/styles/global.css`:
```css
:root {
  --accent-color: #your-color;
  --bg-primary: #your-color;
  /* ... other variables */
}
```

## 🐛 Known Limitations

- Image URLs must be valid URLs
- No image upload functionality (URLs only)
- No user authentication (demo purposes)
- No real-time updates (manual refresh required)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a React assessment.

## 👨‍💻 Author

Created as a React-based personal project showcase application with modern frontend development practices.

---

**Note**: This is a demonstration project showcasing React concepts including state management, routing, API integration, and responsive design. The backend uses JSON Server for mock data persistence.
