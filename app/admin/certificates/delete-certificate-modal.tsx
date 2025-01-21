import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from '@nextui-org/react';
import axios from 'axios';
import type { Certificate } from '@/app/utils/types';
import toast from 'react-hot-toast';

interface DeleteCertificateModalProps {
    certificate: Certificate | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const DeleteCertificateModal: React.FC<DeleteCertificateModalProps> = ({ certificate, isOpen, onClose, mutate }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!certificate) return;

        setIsSubmitting(true);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/certificates/${certificate.id}`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            toast.success('Operation successful!');
            mutate();
            onClose();
        } catch (error) {
            toast.error('Something went wrong.');
            console.error('Error deleting certificate:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Delete {certificate?.name}</h1>
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this certificate? This action cannot be undone.</p>
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

export default DeleteCertificateModal;
