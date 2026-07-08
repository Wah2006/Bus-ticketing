export default function Table({ columns, data, loading = false }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-neutral-500">
                No data available
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b-2 border-neutral-200">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-3 text-left text-sm font-semibold text-neutral-700"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-6 py-4 text-sm text-neutral-900"
                                >
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
