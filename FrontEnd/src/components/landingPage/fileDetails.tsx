import * as React from "react";
import { Modal } from "@fluentui/react"
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
            <h1>Author: {authorData}</h1>
            <hr />
            <p>Participants</p>
            <p>{file.name}</p>
        </Modal>
    )
}

export default FileDetails;