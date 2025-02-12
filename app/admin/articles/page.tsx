'use client';

import "lightbox2/dist/css/lightbox.min.css";
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import fetchWithToken from '@/app/utils/fetch-with-token';
import type { Article } from '@/app/utils/types';
import { Column } from '@/app/utils/types';

import { DataTable } from '@/components/data-table';
import LoadingDot from '@/components/loading-dot';
import AddModal from './add-article-modal';
import EditModal from './edit-article-modal';
import DeleteModal from './delete-article-modal';

import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Link } from '@heroui/react';
import SeeMoreText from "@/components/see-more-text";
export default function Property() {
    const { data, error, mutate } = useSWR<{ code: number; message: string; records: Article[] }>(
        'https://abicmanpowerservicecorp.com/api/articles',
        fetchWithToken
    );

    const [articles, setArticles] = useState<Article[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // State to manage which article's content is visible
    const [visibleContent, setVisibleContent] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (typeof window !== "undefined") {
            require("lightbox2");
        }
    }, []);

    useEffect(() => {
        if (data && data.records) {
            setArticles(data.records);
        }
    }, [data]);

    const handleAction = (article: Article) => {
        setSelectedArticle(article);
        setEditModalOpen(true);
    };

    const handleDelete = (article: Article) => {
        setSelectedArticle(article);
        setDeleteModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedArticle(null);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedArticle(null);
    };

    const toggleContentVisibility = (id: string) => {
        setVisibleContent((prev) => {
            const newVisibleContent = new Set(prev);
            if (newVisibleContent.has(id)) {
                newVisibleContent.delete(id);
            } else {
                newVisibleContent.add(id);
            }
            return newVisibleContent;
        });
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <LoadingDot />;
    }

    const columns: Column<Article>[] = [
        { key: 'title', label: 'Title' },
        { key: 'date', label: 'Date' },
        { key: 'content', label: 'Content', render: (data) => <div className="w-[500px] lg:w-[800px]"><SeeMoreText text={data.content || "No message"} /></div> },
        { key: 'type', label: 'Type' },
        {
            key: 'image',
            label: 'Preview',
            render: (article) => (
                article.image ? (
                    article.image.includes('mp4') ? (
                        <video
                            src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/articles/${article.image}`}
                            className="h-24 w-24 object-fit"
                            controls
                            poster="/image/play-button.png"
                        />
                    ) : (
                        <a
                            data-lightbox="gallery"
                            data-title={article.title}
                            href={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/articles/${article.image}`}
                        >
                            <img
                                alt={article.title}
                                className="h-24 w-24 object-cover"
                                src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/articles/${article.image}`}
                            />
                        </a>
                    )
                ) : (
                    <p>No media available</p>
                )
            ),
        }
    ];

    return (
        <section className="pt-24 px-4 md:px-12">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-violet-800 uppercase text-center">articles</h1>
                    {/* <Breadcrumbs>
                        <BreadcrumbItem>
                            <Link href="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link href="/properties">Articles</Link>
                        </BreadcrumbItem>
                    </Breadcrumbs> */}
                </div>
                <AddModal mutate={mutate} />
            </div>

            <div className='py-6'>
                <Card>
                    <CardBody>
                        <DataTable<Article>
                            data={articles}
                            columns={columns}
                            itemsPerPage={5}
                            onAction={handleAction}
                            onDelete={handleDelete}
                        />
                    </CardBody>
                </Card>
            </div>

            {selectedArticle && (
                <EditModal
                    article={selectedArticle}
                    isOpen={isEditModalOpen}
                    mutate={mutate}
                    onClose={handleCloseEditModal}
                />
            )}
            {selectedArticle && (
                <DeleteModal
                    article={selectedArticle}
                    isOpen={isDeleteModalOpen}
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </section>
    );
}