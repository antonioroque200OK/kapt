import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OTPModal } from '@/components/OTPModal';
import * as api from '@/lib/api';

jest.mock('@/lib/api', () => ({
    ...jest.requireActual('@/lib/api'),
    requestOTP: jest.fn(),
    verifyOTP: jest.fn(),
}));

const mockedRequestOTP = api.requestOTP as jest.MockedFunction<typeof api.requestOTP>;
const mockedVerifyOTP = api.verifyOTP as jest.MockedFunction<typeof api.verifyOTP>;

const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('OTPModal', () => {
    it('renders contact input in idle state', () => {
        render(<OTPModal {...defaultProps} />);
        expect(screen.getByPlaceholderText('WhatsApp ou e-mail')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /receber código/i })).toBeInTheDocument();
    });

    it('shows loading state during OTP request', async () => {
        mockedRequestOTP.mockImplementation(() => new Promise(() => {})); // never resolves
        render(<OTPModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('WhatsApp ou e-mail'), {
            target: { value: 'test@kapt.run' },
        });
        fireEvent.click(screen.getByRole('button', { name: /receber código/i }));

        await waitFor(() => {
            expect(screen.getByText(/enviando/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled();
        });
    });

    it('shows PT-BR error message on failed OTP request', async () => {
        mockedRequestOTP.mockRejectedValue(new api.ApiError(500, 'server error'));
        render(<OTPModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('WhatsApp ou e-mail'), {
            target: { value: 'test@kapt.run' },
        });
        fireEvent.click(screen.getByRole('button', { name: /receber código/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível enviar o código');
        });
    });

    it('advances to code step after successful OTP request', async () => {
        mockedRequestOTP.mockResolvedValue(undefined);
        render(<OTPModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('WhatsApp ou e-mail'), {
            target: { value: 'test@kapt.run' },
        });
        fireEvent.click(screen.getByRole('button', { name: /receber código/i }));

        await waitFor(() => {
            expect(screen.getByPlaceholderText('0000')).toBeInTheDocument();
        });
    });

    it('shows loading state during code verification', async () => {
        mockedRequestOTP.mockResolvedValue(undefined);
        mockedVerifyOTP.mockImplementation(() => new Promise(() => {})); // never resolves
        render(<OTPModal {...defaultProps} />);

        // Advance to code step
        fireEvent.change(screen.getByPlaceholderText('WhatsApp ou e-mail'), {
            target: { value: 'test@kapt.run' },
        });
        fireEvent.click(screen.getByRole('button', { name: /receber código/i }));
        await waitFor(() => expect(screen.getByPlaceholderText('0000')).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText('0000'), { target: { value: '1234' } });
        fireEvent.click(screen.getByRole('button', { name: /verificar/i }));

        await waitFor(() => {
            expect(screen.getByText(/verificando/i)).toBeInTheDocument();
        });
    });

    it('shows "Código inválido" error on 401 response', async () => {
        mockedRequestOTP.mockResolvedValue(undefined);
        mockedVerifyOTP.mockRejectedValue(new api.ApiError(401, 'unauthorized'));
        render(<OTPModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('WhatsApp ou e-mail'), {
            target: { value: 'test@kapt.run' },
        });
        fireEvent.click(screen.getByRole('button', { name: /receber código/i }));
        await waitFor(() => expect(screen.getByPlaceholderText('0000')).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText('0000'), { target: { value: '9999' } });
        fireEvent.click(screen.getByRole('button', { name: /verificar/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Código inválido');
        });
    });

    it('calls onSuccess with token after successful verification', async () => {
        jest.useFakeTimers();
        mockedRequestOTP.mockResolvedValue(undefined);
        mockedVerifyOTP.mockResolvedValue({ token: 'abc-token-123' });
        render(<OTPModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('WhatsApp ou e-mail'), {
            target: { value: 'test@kapt.run' },
        });
        fireEvent.click(screen.getByRole('button', { name: /receber código/i }));
        await waitFor(() => expect(screen.getByPlaceholderText('0000')).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText('0000'), { target: { value: '1234' } });
        fireEvent.click(screen.getByRole('button', { name: /verificar/i }));

        await waitFor(() => expect(screen.getByText(/identidade confirmada/i)).toBeInTheDocument());

        jest.runAllTimers();
        expect(defaultProps.onSuccess).toHaveBeenCalledWith('abc-token-123');
        jest.useRealTimers();
    });

    it('calls onClose when backdrop is clicked', () => {
        render(<OTPModal {...defaultProps} />);
        const backdrop = screen.getByLabelText('Fechar modal');
        fireEvent.click(backdrop);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
});
