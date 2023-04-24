import styles from "./addFile.module.css";
import { PrimaryButton } from "@fluentui/react";
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';

export default function AddFile(){
    const options: IDropdownOption[] = [
        { key: "unknown", text: "unknown"},
        { key: "archive", text: "archive"},
        { key: "document", text: "document"},
        { key: "photo", text: "photo"},
        { key: "text", text: "text"},
    ]

    return(
        <div className={styles.container}>
            <div>
                <h1>Adding file</h1>
                <div className={styles.buttonWrapper}>
                    <span className={styles.label}>Upload File</span>
                    <input type="file" name="upload" className={styles.upload} placeholder="Upload File" />
                </div>
                <div className={styles.detailsContainer}>
                    <TextField label="File name" required />
                    <TextField label="File extension" required />
                    <TextField label="File size" disabled />
                    <Dropdown
                        placeholder=""
                        label="Select file type"
                        options={options}
                        required
                    />
                    <div className={styles.submitContainer}>
                        <PrimaryButton
                            text="Submit" 
                            allowDisabledFocus 
                            checked
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}