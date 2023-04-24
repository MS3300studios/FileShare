import * as React from "react";
import styles from "./addFile.module.css";
import { Callout, PrimaryButton } from "@fluentui/react";
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { BiError } from "react-icons/bi";
import { redirect } from "react-router-dom";

interface File{
    name: string;
    type: string;
    size: number;
    extension: string;
}

export default function AddFile(){
    const [calloutVisible, setCalloutVisible] = React.useState(false);
    const [calloutText, setCalloutText] = React.useState("");
    const [file, setFile] = React.useState<File | null>();
    const [selectedType, setSelectedType] = React.useState<string>("document");

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
    }

    const handleSubmit = () => {
        if(!file)
            return;
        alert("making API call");
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
                        <PrimaryButton
                            text="Submit" 
                            allowDisabledFocus 
                            checked
                            disabled={!file}
                            onClick={handleSubmit}
                        />
                    </div>
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