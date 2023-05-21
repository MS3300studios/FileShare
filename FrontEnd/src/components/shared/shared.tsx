import * as React from "react";
import { Callout, PrimaryButton, Spinner, SpinnerSize } from "@fluentui/react";
import { getToken } from "../../utils/getToken";
import styles from "./shared.module.css";
import Card from "../landingPage/card";

const Shared = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCalloutVisible, setIsCalloutVisible] = React.useState(false);
    const [files, setFiles] = React.useState<any[]>([]);
    const [fileToDownloadId, setFileToDownloadId] = React.useState<string>("");
    const targetRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        fetch(`http://localhost:3000/files/shared/`, { headers: { Authorization: getToken() } })
        .then(resp => {
            return resp.json();
        }).then(data => {
            setIsLoading(false);
            setFiles(data.files);
        }).catch(err => {
            console.log(err)
        });
    }, [])

    const modalHandler = (id: string | undefined) => {
        if(!id) return;
        setFileToDownloadId(id);
        setIsCalloutVisible(true);
    }

    const toggleCallout = () => {
        setIsCalloutVisible(prev => !prev)
        setFileToDownloadId("");
    }

    const handleDownload = () => {
        if(fileToDownloadId === "") return;

        fetch(`http://localhost:3000/files/download/${fileToDownloadId}`, 
            { headers: { Authorization: getToken() }
        })
        .then(response => {
            if (response.ok) {
                const targetFile = files.filter(f => f._id === fileToDownloadId)[0] //always unique
                
                response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = targetFile.name;
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

    return (
        <div className={styles.mainContainer}>
            {
                isLoading ? <Spinner size={SpinnerSize.large} /> : (
                    <>
                        {
                            files.length === 0 ? (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                <h1 style={{ marginBottom: "0px" }}>Nobody is sharing their files with you yet!</h1>
                                <p>To change that go to your contacts, add people to the list and ask them for access</p>
                                </div>
                            ) : (
                                <div>
                                    <h1>Files shared with me</h1>
                                    { files.map((item, id) => (
                                        <div key={id} ref={targetRef}>
                                            <Card 
                                                id={item._id}
                                                userId={item.userId}
                                                name={item.name}
                                                docType={item.type}
                                                ext={item.extension}
                                                size={item.size}
                                                uploadedAt={item.createdAt}
                                                modalHandler={modalHandler}
                                            />
                                        </div>
                                    )) }
                                    {isCalloutVisible && (
                                        <Callout target={targetRef.current} onDismiss={toggleCallout}>
                                            <div className={styles.calloutInternalContainer}>
                                                <p>Do you want to download this file?</p>
                                                <PrimaryButton text="Download" onClick={handleDownload} />
                                            </div>
                                        </Callout>
                                    )}
                                </div>
                            ) 
                        }
                    </>
                )
            }
        </div>
    )
}

export default Shared;