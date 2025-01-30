import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@heroui/react";
import axios from 'axios';
import type { Partner } from '@/app/utils/types';

interface DeletePartnerModalProps {
    partner: Partner | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const DeletePartnerModal: React.FC<DeletePartnerModalProps> = ({ partner, isOpen, onClose, mutate }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!partner) return;

        setIsSubmitting(true);
        const token = sessionStorage.getItem('token');
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/partners/${partner.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            mutate();
            onClose();
        } catch (error) {
            console.error('Error deleting partner:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Delete {partner?.name}</h1>
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this partner? This action cannot be undone.</p>
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

export default DeletePartnerModal;
