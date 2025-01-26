export const sortArray = <T>(
    array: T[],
    key: keyof T,
    direction: 'asc' | 'desc'
): T[] => {
    return [...array].sort((a, b) => {
        const aValue = a[key] || '';
        const bValue = b[key] || '';

        if (direction === 'asc') {
            return String(aValue).localeCompare(String(bValue));
        }
        return String(bValue).localeCompare(String(aValue));
    });
};