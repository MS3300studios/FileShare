import * as React from "react";
import styles from "./contacts.module.css";
import { getToken } from "../../utils/getToken";

export default function Contacts(){
    const [contacts, setContacts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

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

    return (
        <div className={styles.container}>
            {
                isLoading ? <p>loading...</p> : (
                    <>
                        { contacts.length > 0 ? <h1>CONTACTS</h1> : <p>You dont have any contacts yet, you can add them here [HYPERLINK]</p>}
                    </>
                )
            }
        </div>
    )
}