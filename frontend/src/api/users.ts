import axios from 'axios';
import { User } from '../types/User.ts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const fetchUsers = async (token: string): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateUserStatus = async (
    token: string,
    ids: number[],
    status: 'active' | 'blocked'
): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(
        `${API_BASE_URL}/users/update-status`,
        { ids, status },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const blockUsers = async (token: string, ids: number[]): Promise<{ message: string }> => {
    return await updateUserStatus(token, ids, 'blocked');
};

export const unblockUsers = async (token: string, ids: number[]): Promise<{ message: string }> => {
    return await updateUserStatus(token, ids, 'active');
};

export const deleteUsers = async (token: string, ids: number[]): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
    });
    return response.data;
};
