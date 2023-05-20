import * as React from "react";
import styles from "./contacts.module.css";
import { getToken } from "../../utils/getToken";
import { Check, MessageBar, MessageBarType, Modal, Persona, PersonaPresence, PersonaSize, PrimaryButton, Spinner, SpinnerSize, TextField } from "@fluentui/react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Permissions } from "./permissions";

interface PersonDTO{
    _id: string;
    email: string;
    nickname: string;
    photo: string;
}

export default function Contacts(){
    const [contacts, setContacts] = React.useState<PersonDTO[]>();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpened, setIsModalOpened] = React.useState(false);
    const [loadingPeople, setLoadingPeople] = React.useState(false);
    const [people, setPeople] = React.useState<PersonDTO[]>([]);
    const [isLoadingRemove, setIsLoadingRemove] = React.useState<string>("");

    const [addedPeople, setAddedPeople] = React.useState<string[]>([]);
    const [isLoadingAddPerson, setIsLoadingAddPerson] = React.useState<string>(""); //person being loaded ID
    const [messageBar, setMessageBar] = React.useState({show: false, type: MessageBarType.error, text: "an error occurred"});
    const [searchString, setSearchString] = React.useState("");

    const [givingPermissionsToUser, setGivingPermissionsToUser] = React.useState("");
    const [givingPermissionsToUserNickName, setGivingPermissionsToUserNickName] = React.useState("");
    const [seeAlreadySharedFiles, setSeeAlreadySharedFiles] = React.useState(false);

    React.useEffect(() => {
        getUserContacts();
    }, [])

    const getUserContacts = () => {
        setIsLoading(true);
        fetch(`http://localhost:3000/contacts`, 
            { headers: { Authorization: getToken() } 
        })
        .then(resp => resp.json())
        .then(data => {
            setContacts(data.contacts);
            setIsLoading(false);
        }).catch(err => {
            console.log(err)
            setMessageBar({show: true, type: MessageBarType.error, text: "an unexpected error occurred. Please try again"})
        })
    }

    const getRandomContacts = () => {
        setLoadingPeople(true);
        fetch(`http://localhost:3000/contacts/people`, 
            { headers: { Authorization: getToken() } 
        }).then(resp => {
            return resp.json()
        }).then((data: PersonDTO[]) => {
            setPeople(data);
            setLoadingPeople(false);
            setIsModalOpened(true);
        }).catch(err => {
            console.log(err)
            setMessageBar({show: true, type: MessageBarType.error, text: "an unexpected error occurred. Please try again"})
        })
    };

    const addPerson = (personId: string) => {
        setIsLoadingAddPerson(personId);

        fetch(`http://localhost:3000/contacts/add/${personId}`, 
            { headers: { Authorization: getToken() } 
        })
        .then(resp => {
            setIsLoadingAddPerson("");
            setAddedPeople(prev => [...prev, personId]);
        }).catch(err => {
            setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"})
        });
    }

    const closeModal = () => {
        setSearchString("");
        getUserContacts();
        setIsModalOpened(false); 
        setLoadingPeople(false);
        // setAddedPeople([])
    }

    const givePermisssions = (userId: string, nickname: string, showAlreadySharedFiles?: boolean) => {
        setGivingPermissionsToUser(userId);
        setGivingPermissionsToUserNickName(nickname);
        if(showAlreadySharedFiles){
            setSeeAlreadySharedFiles(true)
        }
    }

    const redirectToChat = (userId: string) => {
        //redirect to chat with user id
    }

    const removeContact = (personId: string) => {
        const token = getToken();

        setIsLoadingRemove(personId);
        fetch(`http://localhost:3000/contacts/remove/${personId}`, 
            { headers: { Authorization: token } 
        }).then(resp => {
            return resp.json()
        }).then(data => {
            console.log(data)
            setIsLoadingRemove("");
            setContacts(data.contacts)
        }).catch(err => {
            setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"})
        });
    }

    const searchForUser = () => {
        setMessageBar({show: true, type: MessageBarType.info, text: "loading..."})
        const token = getToken();
        fetch(`http://localhost:3000/contacts/person/${searchString}`, 
            { headers: { Authorization: token } 
        }).then(resp => {
            return resp.json()
        }).then(data => {
            if(data.length === 0) {
                setMessageBar({show: true, type: MessageBarType.info, text: "no matches were found for this query"})
                return;
            }
            setPeople(data)
            setMessageBar({show: false, type: MessageBarType.info, text: ""})
        });
    }

    return (
        <>
        { contacts?.length !== 0 && <div style={{width: "100%", display: "flex", justifyContent: "center", marginTop: "5px"}}>
            <PrimaryButton onClick={getRandomContacts}>{loadingPeople ? "Please wait" : "Add contacts"}</PrimaryButton>
        </div>}
        <div className={styles.container}>
            {
                isLoading ? <Spinner size={SpinnerSize.large} /> : (<>
                    { (contacts && contacts.length > 0) ? <>
                        {
                            <div style={{width: "80%"}}>
                            {contacts.map((el, id) => (
                                <div className={styles.singleContact} key={id}>
                                    <Persona 
                                        imageUrl={el.photo}
                                        text={el.nickname}
                                        secondaryText={el.email}
                                        size={PersonaSize.size72}
                                        presence={PersonaPresence.online}
                                        imageAlt={`photo of ${el.nickname}`}
                                    />
                                    <span>
                                        <PrimaryButton onClick={() => givePermisssions(el._id, el.nickname)}>Give access to files for this user</PrimaryButton>
                                        <PrimaryButton onClick={() => givePermisssions(el._id, el.nickname, true)}>View files shared with user</PrimaryButton>
                                        <PrimaryButton onClick={() => redirectToChat(el._id)}>Chat</PrimaryButton>
                                        <PrimaryButton onClick={() => removeContact(el._id)}>{ isLoadingRemove === el._id ? <Spinner size={SpinnerSize.small} /> : "Remove from Contacts" }</PrimaryButton>
                                    </span>
                                </div>
                            ))}
                            </div>
                        }
                    </> : 
                        <div>
                            <p>You dont have any contacts yet, you can add them here <PrimaryButton onClick={getRandomContacts}>{loadingPeople ? "Please wait" : "Add contacts"}</PrimaryButton></p>
                        </div>
                    }
                </>)
            }
            <Modal isOpen={givingPermissionsToUser !== ""} onDismiss={() => {setGivingPermissionsToUser(""); setGivingPermissionsToUserNickName(""); setSeeAlreadySharedFiles(false)}} titleAriaId="Give permissions" containerClassName={styles.modalClass}>
                <Permissions 
                    contactId={givingPermissionsToUser} 
                    contactNickname={givingPermissionsToUserNickName} 
                    seeAlreadySharedFiles={seeAlreadySharedFiles}
                />
            </Modal>
            <Modal isOpen={isModalOpened} onDismiss={closeModal} titleAriaId="Add contacts" containerClassName={styles.modalClass}>
                <h4 className={styles.modalHeader}>Add new contacts</h4>
                <div style={{borderBottom: "3px solid black", padding: "5px"}}>
                    <TextField label="search for user with nickname or email" onChange={(e) => setSearchString(e.currentTarget.value)} value={searchString} />
                    <PrimaryButton style={{marginTop: "5px"}} onClick={searchForUser}>Search</PrimaryButton>
                    <PrimaryButton style={{marginTop: "5px", marginLeft: "5px"}} onClick={getRandomContacts}>Reset</PrimaryButton>
                </div>
                { messageBar.show &&
                    <>
                    <div style={{marginTop: "10px"}}></div>
                    <MessageBar messageBarType={messageBar.type}>
                        {messageBar.text}
                    </MessageBar> 
                    </>
                }
                <div className={styles.peopleContainer}>
                {people.map((el, id) => (
                    <div key={id}>
                    <div className={styles.personaContainer}>
                        <Persona 
                            imageUrl={el.photo}
                            text={el.nickname}
                            secondaryText={el.email}
                            size={PersonaSize.size72}
                            presence={PersonaPresence.online}
                            imageAlt={`photo of ${el.nickname}`}
                        />
                        <div onClick={() => addPerson(el._id)} className={styles.addPersonIcon}>
                        {
                            isLoadingAddPerson === el._id ? <Spinner size={SpinnerSize.large} /> : <>
                            {
                                addedPeople.indexOf(el._id) !== -1 ? <Check checked /> :
                                <AiOutlineUserAdd size={"30px"}/>
                            }
                            </>
                        }
                        </div>
                    </div>
                    { people.length-1 !== id && <hr /> }
                    </div>
                ))}
                </div>
            </Modal>
        </div>
        </>
    )
}