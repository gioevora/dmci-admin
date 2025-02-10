import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@heroui/react";
import axios from 'axios';
import type { Property } from '@/app/utils/types';
import toast from 'react-hot-toast';

interface DeleteModalProps {
    property: Property | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ property, isOpen, onClose, mutate }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!property) return;

        setIsSubmitting(true);
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${property.id}`, {
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
                    <h1>Delete {property?.name}</h1>
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this property? This action cannot be undone.</p>
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
