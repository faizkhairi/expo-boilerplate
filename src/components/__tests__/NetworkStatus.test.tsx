import { act, render, screen } from '@testing-library/react-native';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { NetworkStatus } from '../NetworkStatus';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { addEventListener: jest.fn() },
}));

type Listener = (state: Partial<NetInfoState>) => void;

describe('NetworkStatus', () => {
  let emit: Listener;
  const unsubscribe = jest.fn();

  beforeEach(() => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation((listener: Listener) => {
      emit = listener;
      return unsubscribe;
    });
  });

  it('renders nothing while online', async () => {
    await render(<NetworkStatus />);
    await act(async () => emit({ isConnected: true, isInternetReachable: true, type: 'wifi' } as never));

    expect(screen.queryByText(/connection|connectivity/)).toBeNull();
  });

  it('renders nothing while reachability is still unknown', async () => {
    await render(<NetworkStatus />);
    await act(async () => emit({ isConnected: true, isInternetReachable: null, type: 'wifi' } as never));

    expect(screen.queryByText(/connection|connectivity/)).toBeNull();
  });

  it('shows a banner when the device is offline', async () => {
    await render(<NetworkStatus />);
    await act(async () => emit({ isConnected: false, isInternetReachable: false, type: 'none' } as never));

    expect(screen.getByText('No internet connection')).toBeTruthy();
  });

  it('shows limited connectivity when connected without internet', async () => {
    await render(<NetworkStatus />);
    await act(async () => emit({ isConnected: true, isInternetReachable: false, type: 'wifi' } as never));

    expect(screen.getByText(/Limited connectivity/)).toBeTruthy();
  });

  it('unsubscribes on unmount', async () => {
    const { unmount } = await render(<NetworkStatus />);
    await act(async () => unmount());

    expect(unsubscribe).toHaveBeenCalled();
  });
});
