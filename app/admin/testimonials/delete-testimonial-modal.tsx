import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from '@nextui-org/react';
import axios from 'axios';
import type { Testimonial } from '@/app/utils/types';
import toast from 'react-hot-toast';

interface DeletePartnerModalProps {
    testimonial: Testimonial | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const DeleteTestimonialModal: React.FC<DeletePartnerModalProps> = ({ testimonial, isOpen, onClose, mutate }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!testimonial) return;

        setIsSubmitting(true);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials/${testimonial.id}`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            toast.success('Operation successful!');
            mutate();
            onClose();
        } catch (error) {
            toast.error('Something went wrong.');
            console.error('Error deleting testimonial:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Delete</h1>
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this testimonial? This action cannot be undone.</p>
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

export default DeleteTestimonialModal;
