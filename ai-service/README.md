# AI Service - README

## Overview
AI Service is a microservice that provides AI-powered content generation for the online shop application. It generates product descriptions and social media posts using OpenAI's GPT models.

## Endpoints

### Health Check
```bash
curl -X GET http://localhost:8085/api/ai/health
```
### login
```bash
curl -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "password"}'
````

### Generate Product Description
```bash
curl -X POST http://localhost:8085/api/ai/generate-description \
  -H "Content-Type: application/json" \
  -H "X-Request-Id: test-request-123" \
  -d '{
    "productName": "Безжични слушалки Sony WH-1000XM5",
    "category": "Електроника",
    "features": ["Активно потискане на шума", "30 часа батерия", "Bluetooth 5.2"],
    "targetAudience": "Професионалисти и меломани"
  }'
```

### Generate Social Media Post
```bash
curl -X POST http://localhost:8085/api/ai/generate-social-post \
  -H "Content-Type: application/json" \
  -H "X-Request-Id: test-request-124" \
  -d '{
    "productName": "Безжични слушалки Sony WH-1000XM5",
    "productDescription": "Премиум слушалки с активно потискане на шума",
    "platform": "instagram",
    "tone": "exciting"
  }'
```

```bash
curl -X POST http://localhost:8081/api/ai/generate-social-post -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc3MjAxMzI2MSwiZXhwIjoxNzcyMDk5NjYxfQ.JTYNd5i2kBIrY4x8Muc4eBBR0lk6BoCpCL_XAlYqmi8" -d '{"productName": "Test Product", "categoryId": 1, "price": 29.99, "currency": "EUR"}' --max-time 10 -v
```

## Testing via Backend (Recommended)

Since the ai-service is internal-only in production, test through the backend:

### Generate Description via Backend
```bash
curl -X POST http://localhost:8081/api/ai/generate-description \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productName": "Безжични слушалки Sony WH-1000XM5",
    "categoryId": 1,
    "price": 649.99,
    "currency": "EUR",
    "imageUrl": "https://example.com/image.jpg",
    "currentDescription": "Existing description if any"
  }'
```

### Generate Social Post via Backend
```bash
curl -X POST http://localhost:8081/api/ai/generate-social-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productName": "Безжични слушалки Sony WH-1000XM5",
    "categoryId": 1,
    "price": 649.99,
    "currency": "EUR",
    "imageUrl": "https://example.com/image.jpg",
    "currentDescription": "Premium headphones with active noise cancellation"
  }'
```

## Rate Limiting

The AI service implements rate limiting:
- **Default**: 10 requests per minute per IP
- **Configurable**: Set `rate-limit.requests-per-minute` in application.properties
- **Response**: 429 Too Many Requests when limit exceeded

### Check Rate Limit Status
Rate limiting is applied per client IP. Monitor logs for rate limit messages.

## Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: GPT model to use (default: gpt-3.5-turbo)
- `OPENAI_MAX_TOKENS`: Maximum tokens per request (default: 500)
- `OPENAI_TEMPERATURE`: Creativity level 0.0-1.0 (default: 0.7)

### Application Properties
```properties
# OpenAI Configuration
openai.api.key=${OPENAI_API_KEY}
openai.model=gpt-3.5-turbo
openai.max-tokens=500
openai.temperature=0.7

# Rate Limiting
rate-limit.requests-per-minute=10
rate-limit.enabled=true
```

## Response Examples

### Successful Description Generation
```json
{
  "requestId": "test-request-123",
  "description": "Открийте перфектния звук с безжичните слушалки Sony WH-1000XM5...",
  "bullets": ["Качествен продукт", "Отлична цена", "Бърза доставка"],
  "seoTitle": "Безжични слушалки Sony WH-1000XM5",
  "seoKeywords": ["Sony", "слушалки", "безжични"],
  "tokensUsed": 156,
  "timestamp": "2024-01-15T10:30:00"
}
```

### Successful Social Post Generation
```json
{
  "requestId": "test-request-124",
  "caption": "🎧 Готови ли сте за звуково преживяване от друго ниво?...",
  "hashtags": ["#Sony", "#WH1000XM5", "#БезжичниСлушалки"],
  "fullText": "🎧 Готови ли сте за звуково преживяване от друго ниво?... #Sony #WH1000XM5 #БезжичниСлушалки",
  "tokensUsed": 98,
  "timestamp": "2024-01-15T10:31:00"
}
```

## Error Responses

### Rate Limit Exceeded (429)
```json
"Rate limit exceeded. Maximum 10 requests per minute allowed."
```

### Service Unavailable (503)
```json
"Unable to process AI request at this time: OpenAI API call failed"
```

### Invalid Request (400)
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Product name is required"
}
```

## Troubleshooting

### Common Issues

#### 1. OpenAI API Quota Exceeded
**Error**: `You exceeded your current quota, please check your plan and billing details`

**Solution**:
- Check your OpenAI account billing and usage
- Upgrade your OpenAI plan if needed
- Wait for quota reset if on free tier

#### 2. Invalid API Key
**Error**: `Incorrect API key provided`

**Solution**:
- Verify OPENAI_API_KEY environment variable
- Check if API key is valid and active
- Regenerate API key if necessary

#### 3. Rate Limit Exceeded
**Error**: `Rate limit exceeded. Maximum 10 requests per minute allowed`

**Solution**:
- Wait for rate limit window to reset (1 minute)
- Reduce request frequency
- Increase rate limit in configuration if needed

#### 4. Service Connection Issues
**Error**: `AI service is temporarily unavailable`

**Solution**:
- Check if ai-service container is running: `docker ps`
- Check ai-service logs: `docker logs online-shop-ai-service`
- Verify network connectivity between services
- Check if OpenAI API is accessible

### Debug Commands

```bash
# Check if ai-service is running
docker ps | grep ai-service

# View ai-service logs
docker logs online-shop-ai-service --tail 50

# Check environment variables
docker exec online-shop-ai-service env | grep OPENAI

# Test OpenAI API directly
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello"}], "max_tokens": 10}'

# Restart ai-service
docker restart online-shop-ai-service
```

## Development

### Local Testing
1. Set OPENAI_API_KEY environment variable
2. Run the service: `mvn spring-boot:run`
3. Test endpoints using curl commands above

### Docker Testing
1. Build: `docker compose build ai-service`
2. Run: `docker compose up ai-service`
3. Test via http://localhost:8085

## Security Notes

- AI service is internal-only (no external ports in production)
- All requests should go through the backend service
- OpenAI API key is never exposed to frontend
- Rate limiting prevents abuse
- Request IDs enable request tracing