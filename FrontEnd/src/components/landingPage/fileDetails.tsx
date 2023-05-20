import * as React from "react";
import { Modal, Separator } from "@fluentui/react"
import styles from "./landingPage.module.css";

interface IProps{
    isModalOpened: boolean;
    closeModal: () => void;
    authorData: string;
    file: any;
}

const FileDetails = ({isModalOpened, closeModal, authorData, file}: IProps) => {
    return (
        <Modal isOpen={isModalOpened} onDismiss={closeModal} titleAriaId="Add contacts" containerClassName={styles.modalClass}>
            <div>
                <h1>This file was uploaded by: {authorData}</h1>
                <Separator />
                <p>Participants</p>
                <p>{file.name}</p>
            </div>
        </Modal>
    )
}

export default FileDetails;