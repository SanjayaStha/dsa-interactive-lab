# Deployment Guide - DSA Interactive Lab

This guide covers deploying the DSA Interactive Lab to various platforms.

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Redis instance (optional for caching)
- Git repository

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis (optional)
REDIS_URL=redis://host:6379

# Next.js
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Set Environment Variables**:
   - Go to your project settings on Vercel dashboard
   - Add environment variables under Settings → Environment Variables
   - Add `DATABASE_URL` and `REDIS_URL`

5. **Connect Database**:
   - Use Vercel Postgres or external PostgreSQL (Supabase, AWS RDS, etc.)
   - Update `DATABASE_URL` in environment variables

6. **Deploy to Production**:
```bash
vercel --prod
```

### Option 2: AWS (EC2 + RDS)

1. **Set up EC2 Instance**:
   - Launch Ubuntu 22.04 LTS instance
   - Configure security groups (ports 80, 443, 22)
   - SSH into instance

2. **Install Dependencies**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

3. **Set up RDS PostgreSQL**:
   - Create RDS PostgreSQL instance
   - Configure security groups
   - Note connection string

4. **Clone and Build**:
```bash
git clone <your-repo-url>
cd dsa-interactive-lab
npm install
npm run build
```

5. **Configure PM2**:
```bash
pm2 start npm --name "dsa-lab" -- start
pm2 save
pm2 startup
```

6. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable SSL with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Docker Deployment

1. **Create Dockerfile**:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Update next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

module.exports = nextConfig;
```

3. **Build and Run**:
```bash
docker build -t dsa-lab .
docker run -p 3000:3000 --env-file .env.production dsa-lab
```

4. **Docker Compose for Full Stack**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/dsa_lab
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: dsa_lab
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Database Migration

Run database migrations after deployment:

```bash
# If using a migration tool
npm run migrate

# Or manually run the init.sql script
psql $DATABASE_URL < db/init.sql
```

## Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Run database migrations
- [ ] Test application functionality
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure CDN for static assets
- [ ] Set up automated backups for database
- [ ] Configure SSL/TLS certificates
- [ ] Set up CI/CD pipeline
- [ ] Configure error tracking
- [ ] Set up performance monitoring

## Monitoring and Maintenance

### Health Checks

Create a health check endpoint at `/api/health`:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
}
```

### Logging

Use structured logging for production:

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

export default logger;
```

### Performance Monitoring

Consider integrating:
- Vercel Analytics
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay

## Scaling Considerations

1. **Database Connection Pooling**: Use PgBouncer or connection pooling
2. **Caching**: Implement Redis caching for frequently accessed data
3. **CDN**: Use Vercel Edge Network or CloudFront for static assets
4. **Load Balancing**: Use AWS ALB or Nginx for multiple instances
5. **Database Replication**: Set up read replicas for heavy read workloads

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (must be 20+)
   - Clear `.next` folder and rebuild
   - Verify all dependencies are installed

2. **Database Connection Issues**:
   - Verify DATABASE_URL is correct
   - Check firewall rules
   - Ensure database is accessible from deployment environment

3. **Performance Issues**:
   - Enable caching
   - Optimize images
   - Use CDN for static assets
   - Implement code splitting

## Support

For deployment issues, check:
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- Project GitHub Issues

## Security Best Practices

1. Keep dependencies updated
2. Use environment variables for secrets
3. Enable HTTPS/SSL
4. Implement rate limiting
5. Use Content Security Policy headers
6. Regular security audits
7. Database connection encryption
8. Input validation and sanitization
