import { describe, it, expect, vi } from 'vitest';
import {
  retryWithBackoff,
  isRetryableError,
  getUserFriendlyErrorMessage
} from './apiUtils.js';

describe('isRetryableError', () => {
  it('should retry on fetch errors', () => {
    const error = new Error('fetch failed');
    expect(isRetryableError(error)).toBe(true);
  });

  it('should retry on 500 server errors', () => {
    const error = new Error('Server error: 500');
    expect(isRetryableError(error)).toBe(true);
  });

  it('should retry on 502 server errors', () => {
    const error = new Error('Server error: 502');
    expect(isRetryableError(error)).toBe(true);
  });

  it('should retry on 503 server errors', () => {
    const error = new Error('Server error: 503');
    expect(isRetryableError(error)).toBe(true);
  });

  it('should retry on 504 server errors', () => {
    const error = new Error('Server error: 504');
    expect(isRetryableError(error)).toBe(true);
  });

  it('should not retry on 400 client errors', () => {
    const error = new Error('Server error: 400');
    expect(isRetryableError(error)).toBe(false);
  });

  it('should not retry on 401 client errors', () => {
    const error = new Error('Server error: 401');
    expect(isRetryableError(error)).toBe(false);
  });

  it('should not retry on 403 client errors', () => {
    const error = new Error('Server error: 403');
    expect(isRetryableError(error)).toBe(false);
  });

  it('should not retry on 404 client errors', () => {
    const error = new Error('Server error: 404');
    expect(isRetryableError(error)).toBe(false);
  });

  it('should not retry on unknown errors', () => {
    const error = new Error('Some random error');
    expect(isRetryableError(error)).toBe(false);
  });
});

describe('getUserFriendlyErrorMessage', () => {
  it('should return network error message for fetch errors', () => {
    const error = new Error('fetch failed');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Cannot connect to server');
    expect(message).toContain('internet connection');
  });

  it('should return timeout message for timeout errors', () => {
    const error = new Error('Request timed out');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('timed out');
    expect(message).toContain('too long to respond');
  });

  it('should return auth error for 401', () => {
    const error = new Error('Server error: 401');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Authentication error');
    expect(message).toContain('session may have expired');
  });

  it('should return access denied for 403', () => {
    const error = new Error('Server error: 403');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Access denied');
    expect(message).toContain('permission');
  });

  it('should return not found for 404', () => {
    const error = new Error('Server error: 404');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Service not found');
    expect(message).toContain('endpoint');
  });

  it('should return rate limit message for 429', () => {
    const error = new Error('Server error: 429');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Too many requests');
    expect(message).toContain('wait');
  });

  it('should return internal error for 500', () => {
    const error = new Error('Server error: 500');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Internal server error');
  });

  it('should return bad gateway for 502', () => {
    const error = new Error('Server error: 502');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Bad gateway');
    expect(message).toContain('temporarily unavailable');
  });

  it('should return service unavailable for 503', () => {
    const error = new Error('Server error: 503');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Service unavailable');
    expect(message).toContain('maintenance');
  });

  it('should return gateway timeout for 504', () => {
    const error = new Error('Server error: 504');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('Gateway timeout');
    expect(message).toContain('too long to respond');
  });

  it('should include agent name in generic error', () => {
    const error = new Error('Unknown error');
    const message = getUserFriendlyErrorMessage(error, 'Test Agent');
    expect(message).toContain('Test Agent');
  });

  it('should use default agent name when not provided', () => {
    const error = new Error('Unknown error');
    const message = getUserFriendlyErrorMessage(error);
    expect(message).toContain('the agent');
  });
});

describe('retryWithBackoff', () => {
  it('should succeed on first attempt if no error', async () => {
    const successFn = vi.fn(async () => 'success');
    const result = await retryWithBackoff(successFn);

    expect(result).toBe('success');
    expect(successFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on retryable errors', async () => {
    let attempt = 0;
    const retryableFn = vi.fn(async () => {
      attempt++;
      if (attempt < 2) {
        throw new Error('Server error: 500');
      }
      return 'success after retry';
    });

    const result = await retryWithBackoff(retryableFn, {
      shouldRetry: isRetryableError,
      initialDelay: 10, // Use very small delay for testing
      maxDelay: 50
    });

    expect(result).toBe('success after retry');
    expect(retryableFn).toHaveBeenCalledTimes(2);
  });

  it('should throw after max retries', async () => {
    const alwaysFailsFn = vi.fn(async () => {
      throw new Error('Server error: 500');
    });

    await expect(
      retryWithBackoff(alwaysFailsFn, {
        maxRetries: 2,
        shouldRetry: isRetryableError,
        initialDelay: 10,
        maxDelay: 50
      })
    ).rejects.toThrow('Server error: 500');

    expect(alwaysFailsFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it('should not retry on non-retryable errors', async () => {
    const clientErrorFn = vi.fn(async () => {
      throw new Error('Server error: 404');
    });

    await expect(
      retryWithBackoff(clientErrorFn, { shouldRetry: isRetryableError })
    ).rejects.toThrow('Server error: 404');

    expect(clientErrorFn).toHaveBeenCalledTimes(1); // No retries
  });

  it('should use custom shouldRetry function', async () => {
    let attempt = 0;
    const fn = vi.fn(async () => {
      attempt++;
      if (attempt < 2) {
        throw new Error('Custom retryable error');
      }
      return 'success';
    });

    const customShouldRetry = (error) => error.message.includes('retryable');

    const result = await retryWithBackoff(fn, {
      shouldRetry: customShouldRetry,
      maxRetries: 2,
      initialDelay: 10,
      maxDelay: 50
    });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should allow custom retry options', async () => {
    let attempt = 0;
    const fn = vi.fn(async () => {
      attempt++;
      if (attempt < 3) {
        throw new Error('Server error: 500');
      }
      return 'success';
    });

    const result = await retryWithBackoff(fn, {
      maxRetries: 5,
      initialDelay: 10,
      maxDelay: 50,
      shouldRetry: isRetryableError
    });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
