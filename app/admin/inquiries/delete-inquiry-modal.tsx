import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@heroui/react";
import axios from 'axios';
import type { Inquiry } from '@/app/utils/types';
import toast from 'react-hot-toast';

interface DeleteModalProps {
    inquiry: Inquiry | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ inquiry, isOpen, onClose, mutate }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!inquiry) return;

        setIsSubmitting(true);
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/inquiries/${inquiry.id}`, {
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
                    <h1>Delete {inquiry?.first_name} {inquiry?.last_name}</h1>
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this inquiry? This action cannot be undone.</p>
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
