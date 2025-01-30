import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@heroui/react";
import axios from 'axios';
import type { Article } from '@/app/utils/types';
import toast from 'react-hot-toast';

interface DeletePartnerModalProps {
    article: Article | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const DeleteModal: React.FC<DeletePartnerModalProps> = ({ article, isOpen, onClose, mutate }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!article) return;

        setIsSubmitting(true);
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${article.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            toast.success('Operation successful!');
            mutate();
            onClose();
        } catch {
            toast.error('Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Delete {article?.title}</h1>
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this article? This action cannot be undone.</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isDisabled={isSubmitting}
                        isLoading={isSubmitting}
                        color="danger"
                        onPress={handleDelete}
                    >
                        Delete
                    </Button>
                    <Button color="default" onPress={onClose} isDisabled={isSubmitting}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteModal;
