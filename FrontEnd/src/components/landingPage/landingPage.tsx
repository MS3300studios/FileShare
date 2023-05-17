import * as React from "react";
import styles from "./landingPage.module.css";
import Card from "./card";
import { IFile } from "../addFile/addFile";
import { Spinner, SpinnerSize } from "@fluentui/react";
import { getToken } from "../../utils/getToken";
import { List } from '@fluentui/react/lib/List';

export default function LandingPage(){
    const [isLoading, setIsLoading] = React.useState(true);
    const [files, setFiles] = React.useState<IFile[]>([]);

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

    }

    return(
        <main>
            <h1 style={{textAlign: "center"}}>Your files</h1>
            {
                isLoading ? <Spinner size={SpinnerSize.large} /> : (
                    <article>
                        { files.length === 0 ? <p style={{fontSize: "20px", fontWeight: "500"}}>You don't have any files yet, click the button on the top menu to add files</p> : (
                            <div className={styles.cardsContainer}>
                                {/* <List
                                    className={styles.listGridExample}
                                    items={files}
                                    renderedWindowsAhead={4}

                                    onRenderCell={onRenderCell}
                                /> */}
                                { files.map((item, id) => (
                                    <Card 
                                        key={id}
                                        id={item._id}
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

// const data = [
//     {
//         name: "Photo1.jpg",
//         size: 1200,
//         uploadedAt: new Date().getDate(),
//         ext: "jpg",
//         docType: "photo"
//     },
//     {
//         name: "Notes.txt",
//         size: 14,
//         uploadedAt: new Date().getDate(),
//         ext: "txt",
//         docType: "text"
//     }
// ]