import * as React from "react";
import styles from "./conversations.module.css";
import { getToken } from "../../utils/getToken";
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, Spinner, SpinnerSize } from "@fluentui/react";
import moment from "moment";
import chatIconImage from "../../assets/chaticon.png";
import { getUser } from "../../utils/getUser";
import { useNavigate } from "react-router-dom";

const Conversation = ({ conversation, navigate }: {conversation: IConversation, navigate: (personId: string) => void}) => {
    const contactData = conversation.participants.filter(par => par._id !== getUser()._id)[0]

    const previewProps: IDocumentCardPreviewProps = {
        previewImages: [
            {
                name: `chat with ${contactData.nickname}`,
                linkProps: {
                    href: '/hello',
                    target: '_blank',
                },
                previewImageSrc: chatIconImage,
                width: 200,
                height: 200,
            },
        ],
    };
    const DocumentCardActivityPeople = [{ name: contactData.nickname, profileImageSrc: contactData.photo }];

    let activity = "no messages have been sent yet";
    if(conversation.messages.length > 0){
        const lastMessage = conversation.messages[conversation.messages.length-1];
        activity = `${lastMessage.text} - ${moment(lastMessage.createdAt).format('MMMM Do, h:mm a')}`
    }

    return (
        <div onClick={() => navigate(contactData._id)}>
        <DocumentCard
                aria-label="conversation"
                onClick={() => console.log('ok')}
            >
            <DocumentCardPreview {...previewProps} />
            <DocumentCardTitle
                title={contactData.nickname}
                shouldTruncate
            />
            <DocumentCardActivity activity={activity} people={DocumentCardActivityPeople} />
        </DocumentCard>
        </div>
    )
}

interface IConversation{
    participants: {
        nickname: string;
        photo: string;
        _id: string;
        email: string
    }[],
    messages: {
        text: string,
        authorId: string,
        createdAt: string;
    }[]
}

const Conversations = () => {
    const [isLoading, setIsloading] = React.useState(true);
    const [conversations, setConversations] = React.useState<IConversation[]>([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = getToken();
        console.log(token)

        fetch(`http://localhost:3000/conversations`, 
            { headers: { Authorization: token }
        })
        .then(response => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            setConversations(data);
            setIsloading(false);
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    const redirectToChat = (personId: string) => {
        navigate('/chat/'+personId);
    }

    if(isLoading)
        return <Spinner size={SpinnerSize.large} />

    return (
        <div className={styles.conversationsContainer}>
            <h1>Your conversations:</h1>
            <div className={styles.conversationsMainContainer}>
            {
                conversations.map((el, key) => (
                    <div key={key}>
                        <Conversation conversation={el} navigate={redirectToChat}/>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default Conversations;