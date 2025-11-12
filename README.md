# Microservices with Kafka

A demonstration project showcasing microservices architecture using Apache Kafka for event-driven communication between services. This repository contains multiple implementations of a simple e-commerce order processing system.

## Project Structure

The repository contains three different implementations:

```
microservices-kafka/
├── 1/                      # Monolithic implementation
│   ├── backend2/           # Express.js backend with synchronous processing
│   └── frontend/           # Next.js frontend application
├── services2/              # Microservices implementation with Kafka
│   ├── client/             # Next.js client application
│   ├── payment-service/    # Payment processing microservice
│   ├── order-service/      # Order management microservice
│   ├── email-service/      # Email notification microservice
│   ├── analytic-service/   # Analytics logging microservice
│   └── kafka/              # Kafka configuration and setup
└── services3/              # Alternative microservices implementation
    └── (similar structure to services2)
```

## Architecture Overview

### Implementation 1: Monolithic (./1)
A traditional monolithic architecture where all business logic is handled in a single backend service:
- **Frontend**: Next.js with React 19, TailwindCSS, and React Query
- **Backend**: Express.js handling payment, order creation, email, and analytics synchronously
- **Stack**: Node.js, Express, CORS, UUID

### Implementation 2 & 3: Microservices (./services2 & ./services3)
Event-driven microservices architecture using Apache Kafka for inter-service communication:
- **Client**: Next.js frontend application
- **Payment Service**: Processes payments and publishes `payment-successful` events
- **Order Service**: Consumes payment events, creates orders, publishes `order-successful` events
- **Email Service**: Consumes order events and sends confirmation emails
- **Analytic Service**: Consumes events from all services for logging and analytics
- **Message Broker**: Apache Kafka (KRaft mode) with Kafka UI for monitoring

## Technology Stack

### Frontend
- Next.js 15.3.3
- React 19
- TailwindCSS 4
- Axios
- React Query (@tanstack/react-query)
- Lucide React (icons)

### Backend Services
- Node.js with ES Modules
- Express.js 5.1.0
- KafkaJS 2.2.4
- CORS

### Infrastructure
- Apache Kafka 3.8.0 (KRaft mode)
- Kafka UI (Provectus Labs)
- Docker & Docker Compose

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

### Running the Monolithic Version (./1)

1. **Start the backend:**
   ```bash
   cd 1/backend2
   npm install
   node index.js
   ```
   Backend runs on `http://localhost:8000`

2. **Start the frontend:**
   ```bash
   cd 1/frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

### Running the Microservices Version (./services2)

1. **Start Kafka and Kafka UI:**
   ```bash
   cd services2/kafka
   docker-compose up -d
   ```
   - Kafka runs on `localhost:9094`
   - Kafka UI available at `http://localhost:8080`

2. **Start all microservices:**

   Payment Service:
   ```bash
   cd services2/payment-service
   npm install
   node index.js
   ```

   Order Service:
   ```bash
   cd services2/order-service
   npm install
   node index.js
   ```

   Email Service:
   ```bash
   cd services2/email-service
   npm install
   node index.js
   ```

   Analytic Service:
   ```bash
   cd services2/analytic-service
   npm install
   node index.js
   ```

3. **Start the client:**
   ```bash
   cd services2/client
   npm install
   npm run dev
   ```
   Client runs on `http://localhost:3000`

## Kafka Configuration

The Kafka setup uses KRaft mode (no Zookeeper required) with the following configuration:

- **Node ID**: 1
- **Roles**: broker, controller
- **Internal Listener**: `kafka:9092` (for inter-service communication)
- **External Listener**: `localhost:9094` (for external connections)
- **Controller**: `kafka:9093`
- **Auto-create topics**: Enabled

### Kafka Topics

The microservices implementation uses the following event topics:

- `payment-successful`: Published by payment service after successful payment
- `order-successful`: Published by order service after order creation
- `analytics`: For logging and analytics events

## API Endpoints

### Monolithic Backend (Port 8000)
- `POST /order` - Create order with payment, analytics, and email

### Microservices
Each service communicates via Kafka events rather than direct HTTP calls.

## Event Flow

```
User Action (Client)
    ↓
Payment Service → Publishes "payment-successful" event
    ↓
Order Service → Consumes "payment-successful" → Publishes "order-successful"
    ↓
Email Service → Consumes "order-successful" → Sends email
    ↓
Analytic Service → Consumes all events → Logs analytics
```

## Authentication

The monolithic implementation includes JWT-based authentication middleware. Users need to provide a valid token in the request headers.

## Development

### Project Scripts

Frontend (Next.js):
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

Backend Services:
- `node index.js` - Start the service

### Environment Variables

Make sure to configure the following if needed:
- Frontend API endpoint (default: `http://localhost:8000`)
- Kafka broker addresses
- CORS origins

## Monitoring

Access the Kafka UI at `http://localhost:8080` to:
- View topics and messages
- Monitor consumer groups
- Inspect broker configurations
- Create and manage topics

## Comparison: Monolithic vs Microservices

| Aspect | Monolithic (./1) | Microservices (./services2) |
|--------|------------------|----------------------------|
| Architecture | Single service | Multiple independent services |
| Communication | Direct function calls | Event-driven via Kafka |
| Scalability | Vertical | Horizontal (per service) |
| Deployment | Single deployment | Independent deployments |
| Complexity | Lower | Higher |
| Fault Tolerance | Single point of failure | Isolated failures |

## License

ISC

## Author

Rishi Khandagle
