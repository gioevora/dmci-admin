import React from 'react';
import {
    Modal as FortuneUIModal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@heroui/react";
import { IoAddCircleOutline } from "react-icons/io5";

interface ModalProps {
    title?: string;
    buttonLabel?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Modal: React.FC<ModalProps> = ({ title, buttonLabel, children, footer, isOpen, setIsOpen }) => {
    return (
        <>
            <Button
                startContent={<IoAddCircleOutline size={24} />}
                className='bg-violet-500 text-white capitalize'
                onPress={() => setIsOpen(true)}
            >
                {buttonLabel}
            </Button>
            <FortuneUIModal
                scrollBehavior="inside"
                placement="center"
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                    <ModalBody className="pb-6">{children}</ModalBody>
                    {footer && <ModalFooter>{footer}</ModalFooter>}
                </ModalContent>
            </FortuneUIModal>
        </>
    );
};
