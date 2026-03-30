# Lost & Found System Backend

AI-powered backend system for matching lost items with found items using vector similarity search and intelligent verification.

## Features

- **User Authentication**: JWT-based authentication system
- **Item Management**: CRUD operations for lost and found items
- **AI Matching**: Vector similarity search using OpenAI embeddings
- **Smart Verification**: AI-generated questions to verify ownership
- **Image Processing**: Automatic image upload and processing
- **Email Notifications**: Automated notifications for matches and contact sharing
- **Contact Sharing**: Secure contact detail sharing after verification

## Technology Stack

- **Framework**: Flask
- **Database**: PostgreSQL with pgvector extension
- **AI/ML**: OpenAI GPT-4 and text-embedding-ada-002
- **Image Storage**: AWS S3
- **Email**: SendGrid
- **Authentication**: JWT tokens

## Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL with pgvector extension
- OpenAI API key
- AWS S3 bucket (for image storage)
- SendGrid API key (for emails)

### Installation

1. **Clone and setup environment**:
   ```bash
   cd backend
   python setup.py
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database URL
   ```

3. **Setup database**:
   ```bash
   # Create PostgreSQL database
   createdb lost_found_db
   
   # Install pgvector extension
   psql lost_found_db -c "CREATE EXTENSION vector;"
   
   # Run migrations
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   flask db upgrade
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Found Items
- `POST /api/found-items` - Submit found item
- `GET /api/found-items` - List user's found items
- `GET /api/found-items/{id}` - Get specific found item
- `PUT /api/found-items/{id}` - Update found item
- `DELETE /api/found-items/{id}` - Delete found item

### Lost Items
- `POST /api/lost-items` - Submit lost item (triggers automatic matching)
- `GET /api/lost-items` - List user's lost items
- `GET /api/lost-items/{id}/matches` - Get matches for lost item

### Matching & Verification
- `GET /api/matches/{id}/questions` - Get verification questions
- `POST /api/matches/{id}/verify` - Submit verification answers
- `GET /api/matches/{id}` - Get match details
- `GET /api/matches/user` - Get all user matches

## System Workflow

### 1. Found Item Submission
```
User submits found item → 
Generate embedding → 
Store in database → 
Send confirmation
```

### 2. Lost Item Submission & Matching
```
User submits lost item → 
Generate embedding → 
Search for similar found items (80%+ similarity) → 
Create match records → 
Generate verification questions → 
Send notification email
```

### 3. Ownership Verification
```
User receives match notification → 
Answers verification questions → 
AI validates responses (85%+ confidence) → 
Share founder's contact details → 
Notify both parties
```

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lost_found_db

# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key

# AWS S3 (for image storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1

# Flask
FLASK_ENV=development
FLASK_DEBUG=True
```

## Database Schema

The system uses PostgreSQL with the pgvector extension for vector similarity search:

- **users**: User accounts and authentication
- **found_items**: Items that have been found
- **lost_items**: Items that have been lost
- **matches**: Matching records with verification data

## AI Components

### 1. Vector Embeddings
- Uses OpenAI's `text-embedding-ada-002` model
- Generates 1536-dimensional vectors for item descriptions
- Enables semantic similarity search

### 2. Verification Questions
- GPT-4 generates specific questions based on found item details
- Questions focus on unique features only the owner would know

### 3. Ownership Verification
- AI evaluates user answers against item details
- Confidence threshold of 85% required for verification

## Security Features

- JWT-based authentication
- Input validation and sanitization
- Image file type and size validation
- Rate limiting ready (implement with Flask-Limiter)
- SQL injection protection via SQLAlchemy ORM

## Development

### Project Structure
```
backend/
├── app/
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── utils/           # Utilities and constants
├── migrations/          # Database migrations
├── requirements.txt     # Python dependencies
└── app.py              # Application entry point
```

### Adding New Features

1. **New Models**: Add to `app/models/`
2. **New Routes**: Add to `app/routes/`
3. **Business Logic**: Add to `app/services/`
4. **Database Changes**: Create migrations with `flask db migrate`

## Deployment

### Production Checklist

- [ ] Set `FLASK_ENV=production`
- [ ] Use strong secret keys
- [ ] Configure production database
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy

### Docker Deployment

```bash
# Build image
docker build -t lost-found-backend .

# Run container
docker run -p 5000:5000 --env-file .env lost-found-backend
```

## Troubleshooting

### Common Issues

1. **pgvector extension not found**:
   ```bash
   # Install pgvector
   sudo apt-get install postgresql-14-pgvector
   # Or compile from source
   ```

2. **OpenAI API errors**:
   - Check API key validity
   - Verify account has sufficient credits
   - Check rate limits

3. **Image upload failures**:
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Ensure bucket exists

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details