import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@heroui/react";
import axios from 'axios';
import type { Item } from '@/app/utils/types';
import toast from 'react-hot-toast';

interface DeletePartnerModalProps {
    item: Item | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const DeletePartnerModal: React.FC<DeletePartnerModalProps> = ({ item, isOpen, onClose, mutate }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!item) return;

        setIsSubmitting(true);
        // console.log(values);
        try {

            const token = sessionStorage.getItem('token');
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/${item.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success('Operation successful!');
            mutate();
            onClose();
        } catch (error) {
            toast.error('Something went wrong.');
            console.error('Error deleting item:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Delete {item?.name}</h1>
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this item? This action cannot be undone.</p>
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
