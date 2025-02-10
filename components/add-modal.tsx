import React from 'react'
import { Modal as FortuneUIModal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button } from "@heroui/react"
import { IoAddCircleOutline } from "react-icons/io5";

interface ModalProps {
    title?: string
    buttonLabel?: string;
    children?: React.ReactNode
    footer?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ title, buttonLabel, children, footer }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button startContent={<IoAddCircleOutline size={24} />} className='bg-violet-500 text-white capitalize' onPress={onOpen}>{buttonLabel}</Button>
            <FortuneUIModal scrollBehavior="inside" placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                    <ModalBody className="pb-6">
                        {children}
                    </ModalBody>
                    {footer && <ModalFooter>{footer}</ModalFooter>}
                </ModalContent>
            </FortuneUIModal >
        </>
    )
}

