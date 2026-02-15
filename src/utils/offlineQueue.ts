import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  data?: any;
  timestamp: number;
}

const QUEUE_KEY = 'offline_request_queue';

/**
 * Offline Request Queue
 *
 * Stores failed requests when offline and retries them when connection is restored.
 */
export class OfflineQueue {
  /**
   * Add a request to the offline queue
   */
  static async enqueue(url: string, method: string, data?: any): Promise<void> {
    try {
      const queue = await this.getQueue();

      const request: QueuedRequest = {
        id: `${Date.now()}-${Math.random()}`,
        url,
        method,
        data,
        timestamp: Date.now(),
      };

      queue.push(request);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

      logger.info('Request queued for offline retry', { url, method });
    } catch (error) {
      logger.error('Failed to enqueue request', error as Error);
    }
  }

  /**
   * Get all queued requests
   */
  static async getQueue(): Promise<QueuedRequest[]> {
    try {
      const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      logger.error('Failed to get queue', error as Error);
      return [];
    }
  }

  /**
   * Remove a request from the queue
   */
  static async dequeue(id: string): Promise<void> {
    try {
      const queue = await this.getQueue();
      const updatedQueue = queue.filter((req) => req.id !== id);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
    } catch (error) {
      logger.error('Failed to dequeue request', error as Error);
    }
  }

  /**
   * Clear all queued requests
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(QUEUE_KEY);
      logger.info('Offline queue cleared');
    } catch (error) {
      logger.error('Failed to clear queue', error as Error);
    }
  }

  /**
   * Process all queued requests
   *
   * @param retryFn - Function to retry each request
   */
  static async processQueue(
    retryFn: (url: string, method: string, data?: any) => Promise<void>
  ): Promise<void> {
    const queue = await this.getQueue();

    if (queue.length === 0) {
      return;
    }

    logger.info(`Processing ${queue.length} queued requests`);

    for (const request of queue) {
      try {
        await retryFn(request.url, request.method, request.data);
        await this.dequeue(request.id);
        logger.info('Queued request successful', { url: request.url });
      } catch (error) {
        logger.error('Queued request failed', error as Error, { url: request.url });
        // Keep in queue for next retry
      }
    }
  }
}
