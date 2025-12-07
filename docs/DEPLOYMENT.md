# Deployment Guide - Fly.io

This guide covers deploying the AI-Enhanced Product Workflow Demo to Fly.io.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Deployment](#initial-deployment)
- [Monitoring](#monitoring)
- [Scaling Configuration](#scaling-configuration)
- [Environment Variables](#environment-variables)
- [Updating the Application](#updating-the-application)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Fly.io Account Setup
1. Sign up at https://fly.io/app/sign-up (GitHub, Google, or Email)
2. Install Fly CLI:
   ```bash
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh

   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```
3. Authenticate:
   ```bash
   fly auth login
   ```

### 2. Required Environment Variables
You'll need:
- **CLAUDE_API_KEY**: Your Anthropic Claude API key (get from https://console.anthropic.com)
- **SESSION_SECRET**: Random 32-character secret for session security

---

## Initial Deployment

### Step 1: Configure Secrets
Before deploying, set your secrets (these are encrypted and never exposed):

```bash
# Set Claude API key
fly secrets set CLAUDE_API_KEY=your_actual_api_key_here

# Generate and set session secret
fly secrets set SESSION_SECRET=$(openssl rand -base64 32)
```

**Verify secrets are set:**
```bash
fly secrets list
```

### Step 2: Deploy Application
```bash
# Deploy to Fly.io
fly deploy

# Follow deployment progress
# The build process will:
# 1. Build the React frontend with Vite
# 2. Create a production Docker image
# 3. Deploy to Fly.io infrastructure
```

### Step 3: Verify Deployment
```bash
# Check application status
fly status

# View recent logs
fly logs

# Open the application in browser
fly open
```

Your application will be available at: `https://[your-app-name].fly.dev`

---

## Monitoring

Fly.io includes built-in monitoring for free tier applications.

### View Application Logs
```bash
# Real-time logs (tail)
fly logs

# Last 100 lines
fly logs --lines 100

# Filter by specific instance
fly logs --instance [instance-id]
```

### Application Metrics

**Dashboard Access:**
```bash
# Open Fly.io dashboard
fly dashboard
```

The dashboard shows:
- **HTTP Request Rate**: Requests per second
- **Response Times**: P50, P95, P99 latencies
- **Error Rates**: 4xx and 5xx errors
- **Instance Health**: CPU, memory, network usage
- **Uptime**: Application availability

**CLI Metrics:**
```bash
# View current status
fly status

# Check health checks
fly checks list
```

### Health Check Endpoint
The application includes a health check at `/api/health`:

```bash
# Test health endpoint
curl https://[your-app-name].fly.dev/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Setting Up Alerts (Optional)

While Fly.io free tier doesn't include custom alerts, you can use external monitoring:

**Option 1: UptimeRobot (Free)**
1. Sign up at https://uptimerobot.com
2. Create HTTP monitor for `https://[your-app-name].fly.dev/api/health`
3. Set check interval to 5 minutes
4. Configure email alerts

**Option 2: Better Stack (Free Tier)**
1. Sign up at https://betterstack.com
2. Add your Fly.io app as a monitored resource
3. Set up incident alerts

---

## Scaling Configuration

### Current Configuration
The application is configured for Fly.io free tier:

```toml
# fly.toml
[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0  # Free tier: stops when inactive

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

### Auto-Scaling Behavior

**Free Tier (Current Setup):**
- **min_machines_running = 0**: Machines stop when inactive (cost optimization)
- **auto_start_machines = true**: Automatically starts on incoming requests
- **auto_stop_machines = true**: Stops after period of inactivity
- **Cost**: $0/month for expected usage
- **Cold Start**: ~1-2 seconds when machine is stopped

**Upgrade to Always-On (Paid):**

If you want to eliminate cold starts:

```bash
# Update fly.toml to keep 1 machine always running
fly scale count 1 --yes
```

This will:
- Keep 1 machine always running (no cold starts)
- Cost: ~$5-10/month depending on region
- Better user experience for high-traffic demos

### Manual Scaling

**Scale machine count:**
```bash
# Scale to 2 machines (load balancing)
fly scale count 2

# Scale back to 1
fly scale count 1
```

**Scale machine resources:**
```bash
# Increase memory (if needed for high traffic)
fly scale memory 512  # 512MB

# Check current scale
fly scale show
```

### Concurrency Limits

Current configuration allows 20-25 concurrent connections per machine:

```toml
[http_service.concurrency]
  type = "connections"
  hard_limit = 25
  soft_limit = 20
```

**Adjust if needed:**
```bash
# Edit fly.toml and redeploy
fly deploy
```

---

## Environment Variables

### Required Variables (Set as Secrets)

| Variable | Description | How to Set |
|----------|-------------|------------|
| `CLAUDE_API_KEY` | Anthropic Claude API key | `fly secrets set CLAUDE_API_KEY=sk-...` |
| `SESSION_SECRET` | Session encryption secret (32+ chars) | `fly secrets set SESSION_SECRET=$(openssl rand -base64 32)` |

### Optional Variables (Set in fly.toml)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Internal server port | `3001` |
| `HOST` | Server bind address | `0.0.0.0` |
| `LOG_LEVEL` | Logging verbosity | `info` |

**Modify optional variables in fly.toml:**
```toml
[env]
  NODE_ENV = "production"
  PORT = "3001"
  HOST = "0.0.0.0"
  LOG_LEVEL = "info"  # error, warn, info, debug
```

### Managing Secrets

```bash
# List secrets (values are hidden)
fly secrets list

# Update a secret
fly secrets set CLAUDE_API_KEY=new_key_here

# Remove a secret
fly secrets unset SECRET_NAME

# Import secrets from .env file
fly secrets import < .env.production
```

---

## Updating the Application

### Deploy New Version
```bash
# After making code changes, deploy:
fly deploy

# Deploy with specific Dockerfile
fly deploy --dockerfile Dockerfile

# Deploy and follow logs
fly deploy --verbose
```

### Rollback to Previous Version
```bash
# List recent releases
fly releases

# Rollback to previous release
fly releases rollback

# Rollback to specific version
fly releases rollback v3
```

### Zero-Downtime Deployments

Fly.io automatically does rolling updates:
1. Deploys new version to new machine
2. Health checks new machine
3. Routes traffic to new machine
4. Shuts down old machine

**Configure deployment strategy in fly.toml:**
```toml
[deploy]
  strategy = "rolling"  # or "immediate", "canary"
```

---

## Troubleshooting

### Application Won't Start

**Check logs for errors:**
```bash
fly logs --lines 100
```

**Common issues:**

1. **Missing Environment Variables**
   ```
   Error: CLAUDE_API_KEY is required
   ```
   **Fix:** `fly secrets set CLAUDE_API_KEY=...`

2. **Server Listening on Wrong Interface**
   ```
   Error: 502 Bad Gateway
   ```
   **Fix:** Ensure server listens on `0.0.0.0` (all interfaces), not `localhost`
   - This is already configured in `server/server.js`

3. **Port Mismatch**
   ```
   Error: Health check failed
   ```
   **Fix:** Ensure `internal_port` in fly.toml matches `PORT` environment variable (3001)

### Deployment Fails

**Build errors:**
```bash
# Check build output
fly deploy --verbose
```

**Common causes:**
- Missing dependencies in `package.json`
- Incorrect Dockerfile paths
- Build errors in React app

**Fix:** Test build locally first:
```bash
npm run build
npm run start:prod
```

### High Response Times / Cold Starts

**Problem:** First request takes 2-3 seconds

**Cause:** Free tier machines stop when inactive

**Solutions:**
1. **Keep machine running (paid):**
   ```bash
   fly scale count 1 --yes
   ```

2. **Optimize cold start:**
   - Reduce Docker image size
   - Minimize server startup time
   - Use health check warmup period

3. **Add warmup ping (external service):**
   - Configure UptimeRobot to ping every 5 minutes
   - Keeps machine warm during active hours

### Session Issues

**Problem:** Sessions not persisting between requests

**Check:**
1. **SESSION_SECRET is set:**
   ```bash
   fly secrets list | grep SESSION_SECRET
   ```

2. **Cookies are working:**
   - Check browser DevTools → Application → Cookies
   - Should see `connect.sid` cookie

3. **Multiple machines causing session loss:**
   - Sessions are in-memory (not shared between machines)
   - **Solution for multi-machine:** Upgrade to Redis-backed sessions

### Memory Issues

**Problem:** Application crashes with out-of-memory errors

**Check current usage:**
```bash
fly status
fly vm status
```

**Solutions:**
1. **Increase memory allocation:**
   ```bash
   fly scale memory 512
   ```

2. **Monitor for memory leaks:**
   ```bash
   fly logs | grep "memory"
   ```

3. **Implement session cleanup:**
   - Currently sessions expire after 2 hours
   - Cleanup runs every hour
   - See `server/middleware/sessionManager.js`

### Database Connectivity (Future)

**If upgrading to PostgreSQL:**
```bash
# Create Postgres database (free tier: 3GB)
fly postgres create

# Attach to app
fly postgres attach [postgres-app-name]

# Connection string automatically added as DATABASE_URL secret
```

### Getting Help

**Fly.io Resources:**
- Documentation: https://fly.io/docs
- Community Forum: https://community.fly.io
- Status Page: https://status.fly.io

**Application Issues:**
- GitHub Issues: https://github.com/[your-repo]/issues
- Application Logs: `fly logs`
- Server Logs: `fly ssh console` then check `/app/logs`

**Emergency Commands:**
```bash
# Restart application
fly apps restart

# SSH into machine
fly ssh console

# View machine details
fly vm status

# Force new deployment
fly deploy --force
```

---

## Best Practices

### Security
1. **Never commit secrets** - Use `fly secrets set` only
2. **Rotate SESSION_SECRET** periodically:
   ```bash
   fly secrets set SESSION_SECRET=$(openssl rand -base64 32)
   ```
3. **Monitor for API key usage** - Check Anthropic dashboard for unexpected usage

### Performance
1. **Enable HTTP/2** - Already enabled via Fly.io proxy
2. **Use CDN for static assets** - Fly.io includes edge caching
3. **Monitor response times** - Set up external monitoring (UptimeRobot)

### Cost Optimization
1. **Use auto-stop for free tier** - Enabled by default
2. **Monitor resource usage** - `fly dashboard`
3. **Set up budget alerts** - In Fly.io billing settings

### Reliability
1. **Health checks configured** - Already set up in fly.toml
2. **Graceful shutdown** - Implemented in server.js
3. **Error handling** - All agents have retry logic and error recovery

---

## Production Checklist

Before going live:
- [ ] Secrets are set (`CLAUDE_API_KEY`, `SESSION_SECRET`)
- [ ] Application deploys successfully (`fly deploy`)
- [ ] Health check passes (`curl https://[app].fly.dev/api/health`)
- [ ] All three agents respond correctly (CSM, PM, Engineering)
- [ ] Session persistence works across requests
- [ ] Reset functionality clears all state
- [ ] Error handling works gracefully
- [ ] Monitoring is set up (Fly.io dashboard + optional external)
- [ ] Response times are acceptable (< 3s for first request, < 1s for subsequent)
- [ ] Documentation is up to date (README.md)

---

## Additional Resources

- **Fly.io Documentation**: https://fly.io/docs
- **Fly.io Pricing**: https://fly.io/docs/about/pricing
- **Fly.io CLI Reference**: https://fly.io/docs/flyctl
- **Application README**: [../README.md](../README.md)
- **Technical Design**: [../doc/technical-design.md](../doc/technical-design.md)
- **Session Management**: [./SESSION_MANAGEMENT.md](./SESSION_MANAGEMENT.md)
