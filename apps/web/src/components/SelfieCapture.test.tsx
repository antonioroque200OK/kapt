import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SelfieCapture } from '@/components/SelfieCapture';
import * as api from '@/lib/api';

// ─── MediaDevices mock ────────────────────────────────────────────────────────

const mockTrackStop = jest.fn();
const mockGetUserMedia = jest.fn();

beforeAll(() => {
    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
        writable: true,
        value: { getUserMedia: mockGetUserMedia },
    });

    // jsdom has no HTMLVideoElement.play; silence the error
    Object.defineProperty(HTMLVideoElement.prototype, 'play', {
        writable: true,
        value: jest.fn(),
    });
});

function makeMockStream() {
    return {
        getTracks: () => [{ stop: mockTrackStop }],
    } as unknown as MediaStream;
}

// ─── api mock ─────────────────────────────────────────────────────────────────

jest.mock('@/lib/api', () => ({
    ...jest.requireActual('@/lib/api'),
    submitSelfie: jest.fn(),
}));
const mockedSubmitSelfie = api.submitSelfie as jest.MockedFunction<typeof api.submitSelfie>;

// ─── canvas mock ──────────────────────────────────────────────────────────────

beforeAll(() => {
    HTMLCanvasElement.prototype.toBlob = function (cb) {
        cb(new Blob(['fake'], { type: 'image/jpeg' }));
    };
    HTMLCanvasElement.prototype.toDataURL = () => 'data:image/jpeg;base64,fake';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HTMLCanvasElement.prototype.getContext = (() => ({ drawImage: jest.fn() })) as any;
});

// ─── helpers ──────────────────────────────────────────────────────────────────

const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockGetUserMedia.mockResolvedValue(makeMockStream());
});

// ─── tests ────────────────────────────────────────────────────────────────────

describe('SelfieCapture', () => {
    it('renders camera step with "Tirar foto" button when permission granted', async () => {
        render(<SelfieCapture {...defaultProps} />);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /tirar foto/i })).toBeInTheDocument();
        });
    });

    it('shows PT-BR error when camera permission is denied', async () => {
        mockGetUserMedia.mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
        render(<SelfieCapture {...defaultProps} />);
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(
                'Permissão de câmera negada',
            );
        });
    });

    it('advances to consent step after capture', async () => {
        render(<SelfieCapture {...defaultProps} />);
        await waitFor(() => screen.getByRole('button', { name: /tirar foto/i }));

        fireEvent.click(screen.getByRole('button', { name: /tirar foto/i }));

        await waitFor(() => {
            expect(screen.getByText('Consentimento LGPD')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
        });
    });

    it('defaults to Global consent and allows switching to Evento-específico', async () => {
        render(<SelfieCapture {...defaultProps} />);
        await waitFor(() => screen.getByRole('button', { name: /tirar foto/i }));
        fireEvent.click(screen.getByRole('button', { name: /tirar foto/i }));
        await waitFor(() => screen.getByRole('button', { name: /confirmar/i }));

        const globalRadio = screen.getByRole('radio', { name: /global/i });
        const eventRadio = screen.getByRole('radio', { name: /evento-específico/i });

        expect(globalRadio).toBeChecked();
        expect(eventRadio).not.toBeChecked();

        fireEvent.click(eventRadio);
        expect(eventRadio).toBeChecked();
        expect(globalRadio).not.toBeChecked();
    });

    it('calls submitSelfie with correct args and triggers onSuccess', async () => {
        jest.useFakeTimers();
        localStorage.setItem('kapt_token', 'test-jwt');
        mockedSubmitSelfie.mockResolvedValue(undefined);

        render(<SelfieCapture {...defaultProps} />);
        await waitFor(() => screen.getByRole('button', { name: /tirar foto/i }));
        fireEvent.click(screen.getByRole('button', { name: /tirar foto/i }));
        await waitFor(() => screen.getByRole('button', { name: /confirmar/i }));

        fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

        await waitFor(() => {
            expect(mockedSubmitSelfie).toHaveBeenCalledWith(
                expect.any(Blob),
                'global',
                'test-jwt',
            );
        });

        await waitFor(() => expect(screen.getByText(/fotos sendo buscadas/i)).toBeInTheDocument());

        act(() => jest.runAllTimers());
        expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
        jest.useRealTimers();
    });

    it('shows PT-BR error message on API failure', async () => {
        mockedSubmitSelfie.mockRejectedValue(new api.ApiError(500, 'server error'));

        render(<SelfieCapture {...defaultProps} />);
        await waitFor(() => screen.getByRole('button', { name: /tirar foto/i }));
        fireEvent.click(screen.getByRole('button', { name: /tirar foto/i }));
        await waitFor(() => screen.getByRole('button', { name: /confirmar/i }));
        fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(
                'Não foi possível enviar sua selfie',
            );
        });
    });

    it('closes when backdrop is clicked', async () => {
        render(<SelfieCapture {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Fechar captura'));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
});
