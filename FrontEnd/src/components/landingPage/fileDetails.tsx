import * as React from "react";
import { DefaultButton, MessageBar, MessageBarType, Modal, Persona, PersonaPresence, PersonaSize, PrimaryButton, Separator, Spinner, SpinnerSize } from "@fluentui/react"
import styles from "./landingPage.module.css";
import moment from "moment";
import { getToken } from "../../utils/getToken";

interface IProps{
    isModalOpened: boolean;
    closeModal: (reload: boolean) => void;
    authorData: string;
    file: any;
}

const FileDetails = ({isModalOpened, closeModal, authorData, file}: IProps) => {
    const [loadingParticipants, setLoadingParticipants] = React.useState(true);
    const [fileParticipants, setFileParticipants] = React.useState<any[]>([]);
    const [loadingDelete, setLoadingDelete] = React.useState(false);

    React.useEffect(() => {
        fetch(`http://localhost:3000/files/participants/${file._id}`, 
            { headers: { Authorization: getToken() }
        })
        .then(resp => resp.json())
        .then(data => {
            setLoadingParticipants(false);
            setFileParticipants(data);
        }).catch(err => {
            console.log(err)
            alert('an unexpected error ocurred while processing the request. Please reload the page and try again.')
        })
    }, [])

    const revokePermissionForUser = (userId: string) => {
        fetch(`http://localhost:3000/files/removeAccess`, 
            { headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify({ fileId: file._id, contactId: userId })
        })
        .then(resp => {
            if(resp.ok){
                setFileParticipants(prev => prev.filter(el => el._id !== userId));
            }
        }).catch(err => {
            console.log(err)
            alert('an unexpected error ocurred while processing the request. Please reload the page and try again.')
        })
    }

    const handleFileDownload = () => {
        fetch(`http://localhost:3000/files/download/${file._id}`, 
            { headers: { Authorization: getToken() }
        })
        .then(response => {
            if (response.ok) {
                response.blob().then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = file.name;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                });
            }
        }).catch(err => {
            console.log(err)
            alert('an unexpected error ocurred while processing the request. Please reload the page and try again.')
        })
    }

    const handleFileDeletion = () => {
        setLoadingDelete(true);
        fetch(`http://localhost:3000/files/delete/${file._id}`, 
            { headers: { Authorization: getToken() }
        })
        .then(response => {
            if (response.ok) {
                closeModal(true);
            }
        }).catch(err => {
            console.log(err)
            alert('an unexpected error ocurred while processing the request. Please reload the page and try again.')
        })
    }

    return (
        <Modal isOpen={isModalOpened} onDismiss={() => closeModal(false)} titleAriaId="Add contacts" containerClassName={styles.modalClass}>
            <div className={styles.modalContainer}>
                <h3>{file.name}</h3>
                <p>This file was uploaded by: {authorData}</p>
                <p>This file was uploaded on {moment(file.createdAt).format('Do MMMM YYYY, h:mm a')}</p>
                <div style={{marginTop: "5px"}}></div>
                    <MessageBar messageBarType={MessageBarType.info}>
                        in order to share this file with your contacts, go to contacts and select the person with whom you want to share this file
                    </MessageBar> 
                <div style={{marginTop: "5px", display: "flex", alignItems: "center"}}>
                    <PrimaryButton text="Download file" onClick={handleFileDownload} />
                    <DefaultButton text="Delete file" onClick={handleFileDeletion} className={styles.deleteButton} />
                    { loadingDelete && <Spinner size={SpinnerSize.small} />}
                </div>
                <Separator />
                {
                    loadingParticipants ? <Spinner size={SpinnerSize.large} /> : (
                        <>
                        { fileParticipants.length === 0 ? <h3>You are not sharing this file with anyone</h3> : <h3>People who have access to this file:</h3> }
                        { fileParticipants.map((el: any, id: number) => (
                            <div key={id} className={styles.personaContainer}>
                                <Persona 
                                    imageUrl={el.photo}
                                    text={el.nickname}
                                    secondaryText={el.email}
                                    size={PersonaSize.size72}
                                    presence={PersonaPresence.online}
                                    imageAlt={`photo of ${el.nickname}`}
                                />
                                <PrimaryButton onClick={() => revokePermissionForUser(el._id)} text="revoke access to this file" />
                            </div>
                        )) }
                        </>
                    )
                }
            </div>
        </Modal>
    )
}

export default FileDetails;