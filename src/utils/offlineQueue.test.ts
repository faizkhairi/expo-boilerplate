import AsyncStorage from '@react-native-async-storage/async-storage';
import { OfflineQueue } from './offlineQueue';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('OfflineQueue', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persists queued requests in order', async () => {
    await OfflineQueue.enqueue('/items', 'POST', { name: 'a' });
    await OfflineQueue.enqueue('/items/1', 'DELETE');

    const queue = await OfflineQueue.getQueue();

    expect(queue.map((r) => [r.url, r.method])).toEqual([
      ['/items', 'POST'],
      ['/items/1', 'DELETE'],
    ]);
    expect(queue[0]?.data).toEqual({ name: 'a' });
  });

  it('removes requests that replay successfully and keeps the ones that fail', async () => {
    await OfflineQueue.enqueue('/ok', 'POST');
    await OfflineQueue.enqueue('/fails', 'POST');
    const retry = jest.fn(async (url: string) => {
      if (url === '/fails') throw new Error('still offline');
    });

    await OfflineQueue.processQueue(retry);

    expect(retry).toHaveBeenCalledTimes(2);
    const remaining = await OfflineQueue.getQueue();
    expect(remaining.map((r) => r.url)).toEqual(['/fails']);
  });

  it('does nothing when the queue is empty', async () => {
    const retry = jest.fn();

    await OfflineQueue.processQueue(retry);

    expect(retry).not.toHaveBeenCalled();
  });

  it('clears the queue', async () => {
    await OfflineQueue.enqueue('/items', 'POST');

    await OfflineQueue.clear();

    await expect(OfflineQueue.getQueue()).resolves.toEqual([]);
  });

  it('returns an empty queue when stored data is corrupt', async () => {
    await AsyncStorage.setItem('offline_request_queue', '{not json');

    await expect(OfflineQueue.getQueue()).resolves.toEqual([]);
  });
});
