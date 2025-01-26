import { toast } from 'react-toastify';
import ApiError from '../types/ApiError';

export const handleApiError = (err: unknown, logout: () => void) => {
    const errorMessage =
        (err as ApiError)?.response?.data?.error || 'An unexpected error occurred';
    if (
        (err as ApiError)?.response?.status === 403 ||
        errorMessage === 'User is blocked' ||
        errorMessage === 'User no longer exists'
    ) {
        toast.error(errorMessage);
        logout();
    } else {
        toast.error(errorMessage);
    }
};