import * as React from "react";
import styles from "./landingPage.module.css";
import Card from "./card";
import { IFile } from "../addFile/addFile";
import { Spinner, SpinnerSize, TextField } from "@fluentui/react";
import { getToken } from "../../utils/getToken";
import FileDetails from "./fileDetails";
import { getUser } from "../../utils/getUser";

export default function LandingPage(){
    const [isLoading, setIsLoading] = React.useState(true);
    const [files, setFiles] = React.useState<IFile[]>([]);
    const [isModalOpened, setIsModalOpened] = React.useState(false);
    const [openedFileId, setOpenedFileId] = React.useState<string | undefined>("");
    const [filterText, setFilterText] = React.useState("");

    React.useEffect(() => {
        fetch(`http://localhost:3000/files`, { headers: { Authorization: getToken() } }).then(resp => {
            return resp.json();
        }).then(data => {
            setIsLoading(false);
            setFiles(data.files)
        }).catch(err => {
            console.log(err)
        });
    }, []);

    const modalHandler = (id: string | undefined) => {
        setIsModalOpened(true);
        setOpenedFileId(id)
    }

    const closeModal = (reload: boolean) => {
        setIsModalOpened(false);
        setOpenedFileId("");
        if(reload){
            fetch(`http://localhost:3000/files`, { headers: { Authorization: getToken() } }).then(resp => {
                return resp.json();
            }).then(data => {
                setIsLoading(false);
                setFiles(data.files)
            }).catch(err => {
                console.log(err)
            });
        }
    }

    const handleFileSearch = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilterText(e.currentTarget.value)
    }

    return(
        <main>
            <h1 style={{textAlign: "center"}}>Your files</h1>
            <div style={{ width: "40%", margin: "0 auto", marginBottom: "10px" }}>
                <TextField placeholder="search for file name" onChange={handleFileSearch} value={filterText} />
            </div>
            { isModalOpened && <FileDetails 
                authorData={getUser().nickname} 
                closeModal={closeModal} 
                isModalOpened={isModalOpened} 
                file={files.filter(el => el._id === openedFileId)[0]} 
            /> }
            {
                isLoading ? <Spinner size={SpinnerSize.large} /> : (
                    <article>
                        { files.length === 0 ? <p style={{fontSize: "20px", fontWeight: "500"}}>You don't have any files yet, click the button on the top menu to add files</p> : (
                            <div className={styles.cardsContainer}>
                                { files.filter(file => file.name.toLowerCase().includes(filterText.toLowerCase())).map((item, id) => (
                                    <Card 
                                        key={id}
                                        id={item._id}
                                        userId={item.userId}
                                        name={item.name}
                                        docType={item.type}
                                        ext={item.extension}
                                        size={item.size}
                                        uploadedAt={item.createdAt}
                                        modalHandler={modalHandler}
                                    />
                                )) }
                            </div>
                        ) }
                    </article>
                )
            }
        </main>
    )
}