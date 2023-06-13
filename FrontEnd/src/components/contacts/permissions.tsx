import * as React from "react";
import styles from "./permissions.module.css";
import { MessageBar, MessageBarType, Separator, Spinner, SpinnerSize } from "@fluentui/react";
import { getToken } from "../../utils/getToken";
import Card from "../landingPage/card";

interface IProps{
    contactId: string;
    contactNickname: string;
    seeAlreadySharedFiles: boolean;
}

export const Permissions = ({ contactId, contactNickname, seeAlreadySharedFiles }: IProps) => {
    const [loadingFiles, setLoadingFiles] = React.useState(true);
    const [files, setFiles] = React.useState<any[]>([]);
    const [alteredFiles, setAlteredFiles] = React.useState<string[]>([]);

    React.useEffect(() => {
        fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/files/${seeAlreadySharedFiles ? "sharedWith" : "notSharedWith"}/${contactId}`, 
            { headers: { Authorization: getToken() } 
        })
        .then(resp => resp.json())
        .then(data => {
            setFiles(data.files);
            setLoadingFiles(false);
        }).catch(err => {
            console.log(err)
            alert('an unexpected error ocurred while processing the request. Please reload the page and try again.')
        })
    }, [])

    const handleFileSelection = (id: string | undefined) => {
        if(!id) return;

        if(seeAlreadySharedFiles){
            fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/files/removeAccess`, 
                { headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
                method: "POST",
                body: JSON.stringify({ fileId: id, contactId: contactId })
            })
            .then(resp => {
                if(resp.ok){
                    setAlteredFiles(prev => [...prev, id])
                }
            }).catch(err => {
                console.log(err)
                alert('an unexpected error ocurred while processing the request. Please reload the page and try again.')
            })
        } else {
            fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/files/share`, 
                { headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
                method: "POST",
                body: JSON.stringify({ fileId: id, contactId: contactId })
            })
            .then(resp => {
                if(resp.ok){
                    setAlteredFiles(prev => [...prev, id])
                }
            }).catch(err => {
                console.log(err)
                alert('an unexpected error ocurred while processing the request. Please reload the page and try again.')
            })
        }
        
    }

    if(loadingFiles) return <Spinner size={SpinnerSize.large} />
    
    return (
        <div className={styles.permissionsContainer}>
            <h3>
                { seeAlreadySharedFiles ? `Files shared with user ${contactNickname}` : `Choose file to which you want to give access for user ${contactNickname}` }
            </h3>
            { seeAlreadySharedFiles && (
                <MessageBar messageBarType={MessageBarType.info}>
                    To remove access to a file from this user, click on the file
                </MessageBar> 
            )}
            <Separator />
            <div className={styles.fileContainer}>
                { files.map((item, id) => (
                    <div key={id} style={ alteredFiles.indexOf(item._id) !== -1 ? { border: "3px solid green" } : {} }>
                        <Card 
                            id={item._id}
                            userId={item.userId}
                            name={item.name}
                            docType={item.type}
                            ext={item.extension}
                            size={item.size}
                            uploadedAt={item.createdAt}
                            modalHandler={handleFileSelection}
                        />
                    </div>
                )) }
            </div>
        </div>
    )
}