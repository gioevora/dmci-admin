'use client';

import React, { useState, useMemo } from 'react';
import { SearchBar } from './search-bar';
import { Pagination } from './pagination';
import { DataTableProps, Column } from '@/app/utils/types';
import { Button } from "@heroui/button";


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
        <div className="md:p-4 bg-white dark:bg-[#18181b] dark:text-white">
            <div className="flex justify-end">
                <SearchBar onSearch={setSearchTerm} />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead>
                        <tr >
                            {columns.map((column) => (
                                <th
                                    key={column.key as string}
                                    className="px-4 py-2 border-b bg-violet-500 text-white uppercase text-sm"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {onAction && <th className="px-4 py-2 border-b bg-violet-500 text-white uppercase text-sm dark:bg-[#27272a]">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onAction ? 1 : 0)}
                                    className="px-4 py-2 text-center"
                                >
                                    No rows to display.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-[#27272a]">
                                    {columns.map((column) => (
                                        <td
                                            key={column.key as string}
                                            className={`px-2 border-b
                                            ${column.key === 'location' ? 'w-1/2' : 'w-auto'} 
                                            ${column.key === 'title' ? 'w-1/5' : 'w-auto'} 
                                            ${column.key === 'content' ? 'w-1/3' : 'w-auto'} 
                                            ${column.key === 'status' ? 'text-tiny font-semibold text-center' : ''}
                                            ${column.key === 'type' ? 'text-tiny font-semibold text-center' : ''} 
                                           `}>

                                            <div className={`py-1 rounded-full 
                                                ${column.key === 'status' && item.status === 'For Sale' ? 'bg-violet-200 text-violet-700 ' : ''}
                                                ${column.key === 'status' && item.status === 'For Rent' ? 'bg-red-200 text-red-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Property Viewing' ? 'bg-red-200 text-red-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Sales Inquiry' ? 'bg-violet-200 text-violet-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Leasing Inquiry' ? 'bg-pink-200 text-pink-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Real Estate News' ? 'bg-amber-200 text-amber-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Real Estate Tips' ? 'bg-lime-200 text-lime-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Seminars' ? 'bg-emerald-200 text-emerrald-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Closed Deals' ? 'bg-cyan-200 text-cyan-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Events' ? 'bg-purple-200 text-purple-700 ' : ''}
                                                ${column.key === 'type' && item.type === 'Admin' ? 'bg-red-200 text-red-700 ' : ''}
                                                  ${column.key === 'type' && item.type === 'Agent' ? 'bg-green-200 text-green-700 ' : ''}
                                                `}>
                                                {renderCell(item, column.key, column)}
                                            </div>
                                        </td>
                                    ))}
                                    {onAction && (
                                        <td className="px-4 border-b">
                                            <div className="flex space-x-2">
                                                <Button
                                                    color="primary"
                                                    onClick={() => onAction(item)}
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    onClick={() => onDelete && onDelete(item)}
                                                    size="sm"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
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
        </div >
    );
}
