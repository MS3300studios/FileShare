import * as React from "react";
import styles from "./addFile.module.css";
import { Callout, MessageBar, MessageBarType, PrimaryButton, Spinner, SpinnerSize } from "@fluentui/react";
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { BiError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/getToken";

export interface IFile{
    name: string;
    type: string;
    size: number;
    extension: string;
    createdAt?: string;
    _id?: string;
}

export default function AddFile(){
    const navigate = useNavigate();
    const [calloutVisible, setCalloutVisible] = React.useState(false);
    const [calloutText, setCalloutText] = React.useState("");
    const [file, setFile] = React.useState<IFile | null>();
    const [fileData, setFileData] = React.useState<any>();
    const [selectedType, setSelectedType] = React.useState<string>("document");
    const [isSendingFile, setIsSendingFile] = React.useState(false);
    const [messageBar, setMessageBar] = React.useState({show: false, type: MessageBarType.error, text: "an error occurred"});

    const options: IDropdownOption[] = [
        { key: "unknown", text: "unknown"},
        { key: "archive", text: "archive"},
        { key: "document", text: "document"},
        { key: "photo", text: "photo"},
        { key: "text", text: "text"},
    ]

    const resetFile = () => {
        setTimeout(() => {
            setCalloutVisible(false);
        }, 2000);
        setFile(null);
        setSelectedType("");
    }

    const handleUpload = (files: FileList | []) => {
        if(files.length !== 1){
            setCalloutText("You can only upload 1 file at a time")
            setCalloutVisible(true);
            resetFile();
            return;
        }

        const file = files[0];
        if(file.size > 10000000){
            setCalloutText("Maximum file size is 10mb (10 million bytes)")
            setCalloutVisible(true);
            resetFile();
            return;
        }

        setFile({
            name: file.name,
            extension: file.name.split(".")[1],
            type: selectedType,
            size: Math.floor(file.size/1000)
        });

        setFileData(file);
    }

    const handleSubmit = () => {
        if(!file) return;
        setMessageBar({show: false, type: MessageBarType.error, text: "an error occurred"})
        setIsSendingFile(true)

        const formData = new FormData();
        formData.append("file", fileData);
        formData.append("type", file.type);
        formData.append("name", file.name);

        fetch(`http://localhost:3000/files/add`, { 
            method: "POST",
            headers: { Authorization: getToken() },
            body: formData
        }).then(resp => {
            console.log(resp)
            setIsSendingFile(false)
            setMessageBar({show: true, type: MessageBarType.success, text: "file upload successful, redirecting..."})
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }).catch(err => {
            console.log(err)
            setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, try again later"})
        });

    };

    return(
        <div className={styles.container}>
            <div>
                <h1>Adding file</h1>
                <div className={styles.buttonWrapper}>
                    <span className={styles.label}>Upload File</span>
                    <input 
                        type="file" 
                        name="upload" 
                        className={styles.upload} 
                        placeholder="Upload File" 
                        onChange={(ev) => handleUpload(ev.target.files ? ev.target.files : [])}
                        id="details"
                    />
                </div>
                <div className={styles.detailsContainer}>
                    <TextField label="File name" required value={file?.name} />
                    <TextField label="File extension" required value={file?.extension} />
                    <TextField label="File size (kb)" disabled value={`${file?.size ? file?.size : 0}`} />
                    <Dropdown
                        placeholder=""
                        label="Select file type"
                        options={options}
                        selectedKey={selectedType}
                        onChange={(ev, item) => setSelectedType(item?.text ? item.text : "photo")}
                        required
                    />
                    <div className={styles.submitContainer}>
                        {isSendingFile ? <Spinner size={SpinnerSize.medium} /> : <PrimaryButton
                            text="Submit" 
                            allowDisabledFocus 
                            checked
                            disabled={!file}
                            onClick={handleSubmit}
                        />}
                    </div>
                    { messageBar.show &&
                        <>
                        <div style={{marginTop: "10px"}}></div>
                        <MessageBar messageBarType={messageBar.type}>
                            {messageBar.text}
                        </MessageBar> 
                        </>
                    }
                    { calloutVisible && <Callout
                        className={styles.callout}
                        role="dialog"
                        gapSpace={0}
                        target={`#details`}
                        onDismiss={() => setCalloutVisible(false)}
                        setInitialFocus>
                            <div className={styles.calloutInfo}>
                                <BiError color="salmon" size={25} />
                                <h1>{calloutText}</h1>
                            </div>
                        </Callout>
                    }
                </div>
            </div>
        </div>
    )
}