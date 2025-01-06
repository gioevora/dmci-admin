'use client';

import React, { useState, useMemo } from 'react';
import { SearchBar } from './search-bar';
import { Pagination } from './pagination';
import { DataTableProps, Column } from '@/app/utils/types';
import { Button } from '@nextui-org/button';

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    itemsPerPage = 10,
    onAction,
    onDelete,
}: DataTableProps<T>) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        return data.filter((item) =>
            Object.values(item).some(
                (value) =>
                    typeof value === 'string' &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, page, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const renderCell = (item: T, columnKey: keyof T, column: Column<T>) => {
        if (column.render) {
            return column.render(item);
        }
        return item[columnKey] ?? '-';
    };

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">
                <SearchBar onSearch={setSearchTerm} />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key as string} className="px-4 py-2 border-b">
                                    {column.label}
                                </th>
                            ))}
                            {onAction && <th className="px-4 py-2 border-b">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (onAction ? 1 : 0)} className="px-4 py-2 text-center">
                                    No rows to display.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    {columns.map((column) => (
                                        <td key={column.key as string} className="px-4 py-2 border-b">
                                            {renderCell(item, column.key, column)}
                                        </td>
                                    ))}
                                    {onAction && (
                                        <td className="px-4 py-2 border-b">
                                            <Button
                                                onClick={() => onAction(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color="danger"
                                                onClick={() => onDelete && onDelete(item)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <Pagination total={totalPages} page={page} onChange={setPage} />
            </div>
        </div>
    );
}