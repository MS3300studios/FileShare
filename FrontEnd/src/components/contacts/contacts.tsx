import * as React from "react";
import styles from "./contacts.module.css";
import { getToken } from "../../utils/getToken";
import { Modal, Persona, PersonaPresence, PersonaSize, PrimaryButton } from "@fluentui/react";
import { AiOutlineUserAdd } from "react-icons/ai";

interface PersonDTO{
    _id: string;
    email: string;
    nickname: string;
    photo: string;
}

export default function Contacts(){
    const [contacts, setContacts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpened, setIsModalOpened] = React.useState(false);
    const [loadingPeople, setLoadingPeople] = React.useState(false);
    const [people, setPeople] = React.useState<PersonDTO[]>([]);

    React.useEffect(() => {
        fetch(`http://localhost:3000/contacts`, 
            { headers: { Authorization: getToken() } 
        })
        .then(resp => resp.json())
        .then(data => {
            setContacts(data.contacts);
            setIsLoading(false);
        })
        //CATCH AND DISPLAY CUSTOM ERROR MESSAGE from fluentui
    }, [])

    const getRandomContacts = () => {
        setLoadingPeople(true);
        fetch(`http://localhost:3000/contacts/people`, 
            { headers: { Authorization: getToken() } 
        })
        .then(resp => resp.json())
        .then((data: PersonDTO[]) => {
            setPeople(data);
            setLoadingPeople(false);
            setIsModalOpened(true);
        })
    };

    const addPerson = () => {

    }

    return (
        <div className={styles.container}>
            {
                isLoading ? <p>loading...</p> : (<>
                    { contacts.length > 0 ? <h1>CONTACTS</h1> : 
                        <div>
                            <p>You dont have any contacts yet, you can add them here <PrimaryButton onClick={getRandomContacts}>{loadingPeople ? "Please wait" : "Add contacts"}</PrimaryButton></p>
                            <Modal isOpen={isModalOpened} onDismiss={() => { setIsModalOpened(false); setLoadingPeople(false); }} titleAriaId="Add contacts" containerClassName={styles.modalClass}>
                                <h4 className={styles.modalHeader}>Add new contacts</h4>
                                <div className={styles.peopleContainer}>
                                {people.map((el, id) => (
                                    <>
                                    <div key={id} className={styles.personaContainer}>
                                        <Persona 
                                            imageUrl={el.photo}
                                            text={el.nickname}
                                            secondaryText={el.email}
                                            size={PersonaSize.size72}
                                            presence={PersonaPresence.online}
                                            imageAlt={`photo of ${el.nickname}`}
                                        />
                                        <div onClick={addPerson} className={styles.addPersonIcon}>
                                            <AiOutlineUserAdd size={"30px"}/>
                                        </div>
                                    </div>
                                    { people.length-1 !== id && <hr /> }
                                    </>
                                ))}
                                </div>
                            </Modal>
                        </div>
                    }
                </>)
            }
        </div>
    )
}