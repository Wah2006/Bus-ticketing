import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

export const useAuth = () => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: async () => {
            try {
                return await apiClient.get('/auth/me');
            } catch {
                return null;
            }
        },
    });

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        localStorage.setItem('access_token', response.token);
        return response;
    };

    const register = async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        localStorage.setItem('access_token', response.token);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
    };

    return {
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };
};
