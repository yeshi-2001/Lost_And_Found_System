# Lost & Found System - Frontend

React frontend for the University Lost & Found System with AI-powered verification.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend server running on http://localhost:5000

### Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Open your browser:**
```
http://localhost:3000
```

## 📱 Features

### ✅ **Authentication**
- User registration with university details
- Login with email or registration number
- JWT token-based authentication
- Auto-redirect on token expiration

### ✅ **Item Management**
- **Found Item Submission:** Report items you've found
- **Lost Item Reporting:** Report items you've lost
- Form validation and error handling
- Auto-matching when lost items are submitted

### ✅ **AI-Powered Verification**
- **Intelligent Matching:** 80%+ similarity algorithm
- **AI Question Generation:** Context-aware verification questions
- **Answer Verification:** 75% accuracy threshold
- **Contact Exchange:** Secure contact sharing after verification

### ✅ **User Interface**
- **Dashboard:** Statistics and recent items
- **Matches View:** Potential matches with similarity scores
- **Verification Flow:** Step-by-step ownership verification
- **Responsive Design:** Works on desktop and mobile

## 🛠️ Technology Stack

- **Framework:** React 18
- **Routing:** React Router DOM 6
- **HTTP Client:** Axios
- **Styling:** Custom CSS with responsive design
- **State Management:** React Hooks (useState, useEffect)

## 📂 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js          # Login form
│   │   ├── Register.js       # Registration form
│   │   ├── Dashboard.js      # Main dashboard
│   │   ├── Navbar.js         # Navigation bar
│   │   ├── FoundItemForm.js  # Found item submission
│   │   ├── LostItemForm.js   # Lost item reporting
│   │   ├── Matches.js        # Potential matches view
│   │   └── Verification.js   # AI verification flow
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── App.js               # Main app component
│   ├── App.css              # Global styles
│   └── index.js             # React entry point
├── package.json
└── README.md
```

## 🔌 API Integration

### Backend Endpoints Used:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/found-items` - Submit found item
- `POST /api/lost-items` - Submit lost item (triggers matching)
- `GET /api/matches/{userId}` - Get potential matches
- `POST /api/verification/questions/{matchId}` - Generate AI questions
- `POST /api/verification/submit/{attemptId}` - Submit verification answers
- `GET /api/form-options` - Get dropdown options

### Authentication:
- JWT tokens stored in localStorage
- Automatic token attachment to requests
- Token expiration handling with redirect

## 🎯 User Flow

### 1. **Registration/Login**
```
Register → Login → Dashboard
```

### 2. **Report Found Item**
```
Dashboard → Found Item Form → Submit → Confirmation
```

### 3. **Report Lost Item (with Matching)**
```
Dashboard → Lost Item Form → Submit → Auto-Match → Matches View
```

### 4. **AI Verification Process**
```
Matches → Select Match → Generate Questions → Answer → Verification Result → Contact Exchange
```

## 🎨 UI Components

### **Forms**
- Comprehensive validation
- Real-time error messages
- Character counters
- Conditional fields (Other location, Not Sure location)

### **Dashboard**
- Statistics cards
- Recent items display
- Quick action buttons
- Responsive grid layout

### **Verification**
- Step-by-step question flow
- Progress indicators
- Success/failure results
- Contact information display

## 🔧 Configuration

### **API Base URL**
Located in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### **Proxy Configuration**
In `package.json`:
```json
"proxy": "http://localhost:5000"
```

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Serve Static Files**
```bash
# Using serve
npm install -g serve
serve -s build

# Using any web server
# Point to the 'build' folder
```

## 📱 Mobile Responsiveness

- Responsive grid layouts
- Mobile-friendly forms
- Touch-optimized buttons
- Flexible navigation

## 🔒 Security Features

- JWT token validation
- Automatic logout on token expiration
- Input sanitization
- Protected routes
- CORS handling

## 🎉 Success Metrics

- **User Experience:** Intuitive interface with clear feedback
- **Verification Accuracy:** AI-powered 75% threshold
- **Mobile Support:** Fully responsive design
- **Performance:** Fast loading and smooth interactions

## 🛠️ Development

### **Available Scripts**
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### **Adding New Features**
1. Create component in `src/components/`
2. Add route in `App.js`
3. Add API calls in `src/services/api.js`
4. Update navigation in `Navbar.js`

## 🎯 Next Steps

- [ ] Add image upload functionality
- [ ] Implement push notifications
- [ ] Add chat system between users
- [ ] Create admin dashboard
- [ ] Add item status tracking
- [ ] Implement email notifications

---

**🎓 University Lost & Found System - Connecting students with their lost items through AI-powered verification!**