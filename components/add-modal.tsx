import React from 'react'
import { Modal as FortuneUIModal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button } from "@nextui-org/react"

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
            <Button color="primary" onPress={onOpen}>{buttonLabel}</Button>
            <FortuneUIModal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                    <ModalBody>
                        {children}
                    </ModalBody>
                    {footer && <ModalFooter>{footer}</ModalFooter>}
                </ModalContent>
            </FortuneUIModal >
        </>
    )
}

