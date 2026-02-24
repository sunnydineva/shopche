# AI Service Architecture & API Specification

## 1. Architecture Schema

### Components Flow:
```
React Admin UI (port 8083)
    ↓ HTTP REST
Shop Backend (port 8081)
    ↓ HTTP REST (internal network)
AI Service (port 8085) - INTERNAL ONLY
    ↓ HTTPS API
OpenAI API
    ↓ Response
AI Service
    ↓ Response
Shop Backend
    ↓ Response
React Admin UI
```

### Component Details:
- **React Admin UI**: New AI buttons in product management
- **Shop Backend**: New AiServiceClient (Feign) + AiController endpoints
- **AI Service**: New microservice with OpenAI integration, rate limiting, logging
- **OpenAI API**: External service for AI generation

### Network Security:
- AI Service accessible only within `shop-network` (Docker internal)
- OpenAI API key stored only in ai-service environment
- X-Request-Id header propagated through all services

## 2. AI Service API Endpoints

### Base URL: `http://ai-service:8085/api/ai`

### 2.1 POST /ai/generate-description

**Request JSON Schema:**
```json
{
  "productName": "string (required)",
  "category": "string (optional)",
  "features": ["string"] (optional),
  "targetAudience": "string (optional)"
}
```

**Response JSON Schema:**
```json
{
  "requestId": "string",
  "description": "string",
  "tokensUsed": "integer",
  "timestamp": "string (ISO 8601)"
}
```

**Example Request:**
```json
{
  "productName": "Безжични слушалки Sony WH-1000XM5",
  "category": "Електроника",
  "features": ["Активно потискане на шума", "30 часа батерия", "Bluetooth 5.2"],
  "targetAudience": "Професионалисти и меломани"
}
```

**Example Response:**
```json
{
  "requestId": "req-123456789",
  "description": "Открийте перфектния звук с безжичните слушалки Sony WH-1000XM5. Благодарение на най-новата технология за активно потискане на шума, ще се потопите в любимата си музика без външни смущения. С впечатляващите 30 часа работа на батерията и Bluetooth 5.2 свързаност, тези слушалки са идеалният спътник за професионалисти и меломани, които ценят качеството и комфорта.",
  "tokensUsed": 156,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2.2 POST /ai/generate-social-post

**Request JSON Schema:**
```json
{
  "productName": "string (required)",
  "productDescription": "string (optional)",
  "platform": "string (required, enum: ['instagram', 'facebook'])",
  "tone": "string (optional, enum: ['casual', 'professional', 'exciting'])"
}
```

**Response JSON Schema:**
```json
{
  "requestId": "string",
  "caption": "string",
  "hashtags": ["string"],
  "tokensUsed": "integer",
  "timestamp": "string (ISO 8601)"
}
```

**Example Request:**
```json
{
  "productName": "Безжични слушалки Sony WH-1000XM5",
  "productDescription": "Премиум слушалки с активно потискане на шума",
  "platform": "instagram",
  "tone": "exciting"
}
```

**Example Response:**
```json
{
  "requestId": "req-123456790",
  "caption": "🎧 Готови ли сте за звуково преживяване от друго ниво? Sony WH-1000XM5 ви пренасят в света на кристално чистия звук! ✨ Забравете за шума около вас и се потопете в любимата си музика. Това е моментът да инвестирате в качеството! 🔥",
  "hashtags": ["#Sony", "#WH1000XM5", "#БезжичниСлушалки", "#КачественЗвук", "#АктивноПотискане", "#Музика", "#Технологии", "#Премиум"],
  "tokensUsed": 98,
  "timestamp": "2024-01-15T10:31:00Z"
}
```

### 2.3 POST /ai/suggest-price

**Request JSON Schema:**
```json
{
  "productName": "string (required)",
  "category": "string (required)",
  "features": ["string"] (optional),
  "competitorPrices": [
    {
      "competitor": "string",
      "price": "number"
    }
  ] (optional),
  "targetMargin": "number (optional, percentage)"
}
```

**Response JSON Schema:**
```json
{
  "requestId": "string",
  "suggestedPrice": "number",
  "priceRange": {
    "min": "number",
    "max": "number"
  },
  "reasoning": "string",
  "tokensUsed": "integer",
  "timestamp": "string (ISO 8601)"
}
```

**Example Request:**
```json
{
  "productName": "Безжични слушалки Sony WH-1000XM5",
  "category": "Премиум слушалки",
  "features": ["Активно потискане на шума", "30 часа батерия", "Bluetooth 5.2"],
  "competitorPrices": [
    {"competitor": "Bose QuietComfort 45", "price": 599.99},
    {"competitor": "Apple AirPods Max", "price": 899.99}
  ],
  "targetMargin": 25
}
```

**Example Response:**
```json
{
  "requestId": "req-123456791",
  "suggestedPrice": 649.99,
  "priceRange": {
    "min": 599.99,
    "max": 699.99
  },
  "reasoning": "Базирайки се на премиум функционалностите и конкурентните цени, препоръчваме цена от 649.99 лв. Това позиционира продукта между Bose (599.99 лв) и Apple (899.99 лв), отразявайки високото качество на Sony при конкурентна цена. Целевата маржа от 25% е постигната.",
  "tokensUsed": 134,
  "timestamp": "2024-01-15T10:32:00Z"
}
```

### Common Headers:
- **X-Request-Id**: Correlation ID (propagated from shop-backend)
- **Content-Type**: application/json
- **Accept**: application/json

### Error Response Schema:
```json
{
  "requestId": "string",
  "error": "string",
  "message": "string",
  "timestamp": "string (ISO 8601)"
}
```

### Rate Limiting:
- 100 requests per minute per IP
- 429 status code when limit exceeded
- Rate limit headers in response