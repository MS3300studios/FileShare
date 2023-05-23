import * as React from "react";
import { DefaultButton, MessageBar, MessageBarType, Modal, Persona, PersonaPresence, PersonaSize, PrimaryButton, Separator, Spinner, SpinnerSize, TextField } from "@fluentui/react"
import styles from "./landingPage.module.css";
import moment from "moment";
import { getToken } from "../../utils/getToken";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { FcCancel } from "react-icons/fc";

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
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentFileName, setCurrentFileName] = React.useState(file.name);
    const [newFileName, setNewFileName] = React.useState(file.name);
    const [nameWasEdited, setNameWasEdited] = React.useState(false);

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

    const handleFileEdit = () => {
        if(newFileName === file.name){
            setIsEditing(false);
            return;
        }

        fetch(`http://localhost:3000/files/edit`, 
            { 
                method: "POST", 
                body: JSON.stringify({name: newFileName, fileId: file._id}), 
                headers: { Authorization: getToken(), 'Content-Type': 'application/json' } 
            }
        ).then(response => {
            if (response.ok) {
                setIsEditing(false);
                setCurrentFileName(newFileName);
                setNameWasEdited(true);
            }
        }).catch(err => {
            console.log(err)
            alert('an unexpected error ocurred while processing the request. Please reload the page and try again.')
        })
    }

    return (
        <Modal isOpen={isModalOpened} onDismiss={() => closeModal(nameWasEdited)} titleAriaId="Add contacts" containerClassName={styles.modalClass}>
            <div className={styles.modalContainer}>
                <div className={styles.headerContainer}>
                    {
                        isEditing ? (
                            <>
                            <TextField value={newFileName} onChange={(e) => setNewFileName(e.currentTarget.value)} className={styles.textField} />
                            <div style={{ display: "flex", width: "70px", alignItems: "center" }}>
                                <div onClick={handleFileEdit} className={styles.editIconContainer} style={{marginRight: "5px"}}>
                                    <AiOutlineCheck size={"2em"} />
                                </div>
                                <div onClick={() => setIsEditing(false)} className={styles.editIconContainer}>
                                    <FcCancel size={"2em"} />
                                </div>
                            </div>
                            </>
                        ) : (
                            <>
                            <h3>{currentFileName}</h3>
                            <div onClick={() => setIsEditing(true)} className={styles.editIconContainer}>
                                <BiEditAlt size={"2em"} />
                            </div>
                            </>
                        )
                    }
                </div>
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