// Standard API response envelope
export const success = (data, meta = null) => {
    return {
        success: true,
        data,
        error: null,
        meta: meta || {},
    };
};

export const error = (code, message, meta = null) => {
    return {
        success: false,
        data: null,
        error: { code, message },
        meta: meta || {},
    };
};

export const paginated = (data, page, pageSize, total) => {
    return {
        success: true,
        data,
        error: null,
        meta: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
};

// Response formatters
export const formatCurrency = (amount) => {
    // Format XAF with space as thousands separator, no decimals
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount) + ' XAF';
};

export const formatDate = (date) => {
    // Format as "12 Jul 2026"
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

export const formatTime = (date) => {
    // Format as 24-hour time "14:30"
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};
