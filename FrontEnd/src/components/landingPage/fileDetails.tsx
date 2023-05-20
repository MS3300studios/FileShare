import * as React from "react";
import { MessageBar, MessageBarType, Modal, Separator } from "@fluentui/react"
import styles from "./landingPage.module.css";
import moment from "moment";

interface IProps{
    isModalOpened: boolean;
    closeModal: () => void;
    authorData: string;
    file: any;
}

const FileDetails = ({isModalOpened, closeModal, authorData, file}: IProps) => {

    React.useEffect(() => {
        console.log(file)
    }, [])

    return (
        <Modal isOpen={isModalOpened} onDismiss={closeModal} titleAriaId="Add contacts" containerClassName={styles.modalClass}>
            <div className={styles.modalContainer}>
                <h3>{file.name}</h3>
                <p>This file was uploaded by: {authorData}</p>
                <p>This file was uploaded on {moment(file.createdAt).format('Do MMMM YYYY, h:mm a')}</p>
                <div style={{marginTop: "5px"}}></div>
                    <MessageBar messageBarType={MessageBarType.info}>
                        in order to share this file with your contacts, go to contacts and select the person with whom you want to share this file
                    </MessageBar> 
                <div style={{marginBottom: "5px"}}></div>
                <Separator />
                { file.participants.length === 0 ? <h3>You are not sharing this file with anyone</h3> : <h3>People who have access to this file:</h3> }
                {file.participants.map((el: any, id: number) => (
                    <div key={id}>
                        <p>{el.nickname}</p>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default FileDetails;