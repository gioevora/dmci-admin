'use client'

import React, { useState, useMemo } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from '@nextui-org/react';
import { SearchBar } from './search-bar';
import { Pagination } from './pagination';
import { DataTableProps, Column } from '@/app/utils/types'

export function DataTable<T>({
    data,
    columns,
    itemsPerPage = 10,
    onAction,
    actionLabel = 'Action',
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
        return item[columnKey];
    };

    return (
        <div>
            <div className="place-items-end">
                <SearchBar onSearch={setSearchTerm} />
            </div>
            <Table aria-label="Data table">
                <TableHeader>
                    {columns.map((column) => (
                        <TableColumn key={column.key as string}>{column.label}</TableColumn>
                    ))}
                    {onAction && <TableColumn>Actions</TableColumn>}
                </TableHeader>
                <TableBody emptyContent={"No rows to display."}>
                    {paginatedData.map((item, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell key={column.key as string}>
                                    {renderCell(item, column.key, column)}
                                </TableCell>
                            ))}
                            {onAction && (
                                <TableCell>
                                    <Button size="sm" onClick={() => onAction(item)}>
                                        {actionLabel}
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination total={totalPages} page={page} onChange={setPage} />
        </div>
    );
}

