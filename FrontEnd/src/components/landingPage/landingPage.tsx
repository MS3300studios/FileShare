import * as React from "react";
import styles from "./landingPage.module.css";
import Card from "./card";
import { IFile } from "../addFile/addFile";
import { Modal, Spinner, SpinnerSize } from "@fluentui/react";
import { getToken } from "../../utils/getToken";
import FileDetails from "./fileDetails";

export default function LandingPage(){
    const [isLoading, setIsLoading] = React.useState(true);
    const [files, setFiles] = React.useState<IFile[]>([]);
    const [isModalOpened, setIsModalOpened] = React.useState(false);
    const [openedFileId, setOpenedFileId] = React.useState<string | undefined>("");

    React.useEffect(() => {
        fetch(`http://localhost:3000/files`, { headers: { Authorization: getToken() } }).then(resp => {
            return resp.json();
        }).then(data => {
            console.log(data.files)

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

    const closeModal = () => {
        setIsModalOpened(false);
        setOpenedFileId("");
    }

    return(
        <main>
            <h1 style={{textAlign: "center"}}>Your files</h1>
            { isModalOpened && <FileDetails 
                authorData="seba1" 
                closeModal={closeModal} 
                isModalOpened={isModalOpened} 
                file={files.filter(el => el._id === openedFileId)[0]} 
            /> }
            {
                isLoading ? <Spinner size={SpinnerSize.large} /> : (
                    <article>
                        { files.length === 0 ? <p style={{fontSize: "20px", fontWeight: "500"}}>You don't have any files yet, click the button on the top menu to add files</p> : (
                            <div className={styles.cardsContainer}>
                                { files.map((item, id) => (
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