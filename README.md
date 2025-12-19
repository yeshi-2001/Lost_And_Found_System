# 🎓 Back2U - University Lost & Found System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3-green.svg)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)](https://openai.com/)

> AI-powered Lost & Found System for university students with intelligent matching and verification

## 🌟 Features

### 🔍 **Smart Item Matching**
- **AI-Powered Search**: Vector similarity matching with 80%+ accuracy
- **Semantic Understanding**: Matches items based on meaning, not just keywords
- **Real-time Results**: Instant matching when lost items are reported

### 🤖 **Intelligent Verification**
- **Dynamic Questions**: AI generates unique verification questions
- **Ownership Proof**: 75% accuracy threshold for secure verification
- **Contact Exchange**: Automatic contact sharing after successful verification

### 📱 **Modern User Experience**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Intuitive Interface**: Clean, user-friendly design with Roboto typography
- **Real-time Search**: Live search across all items with dropdown results
- **Dashboard Analytics**: Personal statistics and activity tracking

### 🔐 **Security & Privacy**
- **JWT Authentication**: Secure token-based authentication
- **Data Protection**: Comprehensive privacy policy and terms
- **Secure Deletion**: Soft/hard delete system with audit trails
- **Input Validation**: Robust validation for all user inputs

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- PostgreSQL with pgvector extension
- OpenAI API key

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/back2u-lost-found.git
cd back2u-lost-found
```

### 2. Backend Setup
```bash
cd backend
python setup.py
cp .env.example .env
# Edit .env with your API keys
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Flask Backend │    │   PostgreSQL    │
│                 │◄──►│                 │◄──►│   + pgvector    │
│  • Dashboard    │    │  • AI Matching  │    │  • Vector Store │
│  • Forms        │    │  • Verification │    │  • User Data    │
│  • Search       │    │  • Authentication│    │  • Items        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   OpenAI API    │
                       │                 │
                       │  • GPT-4        │
                       │  • Embeddings   │
                       └─────────────────┘
```

## 📂 Project Structure

```
back2u-lost-found/
├── 📁 frontend/                 # React application
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   ├── 📁 services/         # API services
│   │   ├── App.js              # Main app
│   │   └── App.css             # Global styles
│   └── package.json
├── 📁 backend/                  # Flask API
│   ├── 📁 app/
│   │   ├── 📁 models/          # Database models
│   │   ├── 📁 routes/          # API endpoints
│   │   ├── 📁 services/        # Business logic
│   │   └── 📁 utils/           # Utilities
│   ├── 📁 migrations/          # Database migrations
│   ├── app.py                  # Flask app
│   └── requirements.txt
├── 📁 .github/                 # GitHub Actions
│   └── 📁 workflows/
├── .gitignore
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Custom CSS** - Responsive styling with Roboto fonts

### Backend
- **Flask** - Python web framework
- **PostgreSQL** - Primary database
- **pgvector** - Vector similarity search
- **SQLAlchemy** - ORM
- **JWT** - Authentication

### AI/ML
- **OpenAI GPT-4** - Question generation and verification
- **text-embedding-ada-002** - Vector embeddings
- **Vector Similarity** - Semantic matching

## 📊 System Workflow

### 1. Item Submission Flow
```mermaid
graph TD
    A[User Reports Found Item] --> B[Generate Embedding]
    B --> C[Store in Database]
    C --> D[Available for Matching]
    
    E[User Reports Lost Item] --> F[Generate Embedding]
    F --> G[Search Similar Items]
    G --> H[Create Matches 80%+]
    H --> I[Generate AI Questions]
    I --> J[Notify User]
```

### 2. Verification Process
```mermaid
graph TD
    A[User Sees Match] --> B[Request Verification]
    B --> C[AI Generates Questions]
    C --> D[User Answers]
    D --> E[AI Validates Answers]
    E --> F{Confidence > 75%?}
    F -->|Yes| G[Share Contact Info]
    F -->|No| H[Verification Failed]
```

## 🎯 Key Components

### Dashboard
- **Welcome Messages**: Time-based greetings with activity tracking
- **Statistics Cards**: Personal item counts with shadows and colors
- **Real-time Search**: Live search with dropdown results
- **Recent Items**: Latest found/lost items with background images

### Verification System
- **AI Question Generation**: Context-aware questions from item descriptions
- **Answer Validation**: Intelligent response evaluation
- **Contact Exchange**: Secure sharing after successful verification

### User Management
- **Registration**: University email validation and terms acceptance
- **Profile**: Horizontal layout with department selection
- **Authentication**: JWT tokens with automatic refresh

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/lost_found_db

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Email (Optional)
SENDGRID_API_KEY=your-sendgrid-key

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm run build
serve -s build
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Performance Metrics

- **Matching Accuracy**: 80%+ similarity threshold
- **Verification Success**: 75%+ confidence requirement
- **Response Time**: < 2 seconds for search results
- **Mobile Support**: Fully responsive design

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and embedding models
- **pgvector** for efficient vector similarity search
- **React** and **Flask** communities for excellent frameworks
- **University students** for feedback and testing

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/back2u-lost-found/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/back2u-lost-found/discussions)
- **Email**: support@back2u.com

---

<div align="center">

**🎓 Built with ❤️ for university students**

[Demo](https://back2u-demo.com) • [Documentation](https://docs.back2u.com) • [Report Bug](https://github.com/yourusername/back2u-lost-found/issues)

</div>