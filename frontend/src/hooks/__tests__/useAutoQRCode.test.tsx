import { renderHook, waitFor } from '@testing-library/react';
import { useAutoQRCode } from '../useAutoQRCode';

// Mock the hooks
jest.mock('../useWhatsAppStatus', () => ({
  useWhatsAppStatus: jest.fn(),
}));

jest.mock('../useQRCode', () => ({
  useQRCode: jest.fn(),
}));

describe('useAutoQRCode', () => {
  const mockGetQRCode = jest.fn();
  const mockUseWhatsAppStatus = require('../useWhatsAppStatus').useWhatsAppStatus;
  const mockUseQRCode = require('../useQRCode').useQRCode;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getQRCode when not connected and no QR code available', async () => {
    mockUseWhatsAppStatus.mockReturnValue({
      status: { isConnected: false },
      isLoading: false,
      error: null,
    });

    mockUseQRCode.mockReturnValue({
      qrCode: null,
      isLoading: false,
      error: null,
      getQRCode: mockGetQRCode,
    });

    renderHook(() => useAutoQRCode());

    await waitFor(() => {
      expect(mockGetQRCode).toHaveBeenCalled();
    });
  });

  it('should not call getQRCode when already connected', () => {
    mockUseWhatsAppStatus.mockReturnValue({
      status: { isConnected: true },
      isLoading: false,
      error: null,
    });

    mockUseQRCode.mockReturnValue({
      qrCode: null,
      isLoading: false,
      error: null,
      getQRCode: mockGetQRCode,
    });

    renderHook(() => useAutoQRCode());

    expect(mockGetQRCode).not.toHaveBeenCalled();
  });

  it('should not call getQRCode when QR code is already available', () => {
    mockUseWhatsAppStatus.mockReturnValue({
      status: { isConnected: false },
      isLoading: false,
      error: null,
    });

    mockUseQRCode.mockReturnValue({
      qrCode: 'test-qr-code',
      isLoading: false,
      error: null,
      getQRCode: mockGetQRCode,
    });

    renderHook(() => useAutoQRCode());

    expect(mockGetQRCode).not.toHaveBeenCalled();
  });

  it('should combine loading states', () => {
    mockUseWhatsAppStatus.mockReturnValue({
      status: { isConnected: false },
      isLoading: true,
      error: null,
    });

    mockUseQRCode.mockReturnValue({
      qrCode: null,
      isLoading: false,
      error: null,
      getQRCode: mockGetQRCode,
    });

    const { result } = renderHook(() => useAutoQRCode());

    expect(result.current.isLoading).toBe(true);
  });

  it('should combine error states', () => {
    mockUseWhatsAppStatus.mockReturnValue({
      status: { isConnected: false },
      isLoading: false,
      error: 'Status error',
    });

    mockUseQRCode.mockReturnValue({
      qrCode: null,
      isLoading: false,
      error: null,
      getQRCode: mockGetQRCode,
    });

    const { result } = renderHook(() => useAutoQRCode());

    expect(result.current.error).toBe('Status error');
  });
}); 