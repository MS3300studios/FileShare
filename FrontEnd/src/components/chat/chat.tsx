import React, { useState } from 'react';
import { List, TextField, PrimaryButton, MessageBarType, MessageBar, Spinner, SpinnerSize } from '@fluentui/react';
import styles from './chat.module.css';
import { v4 as uuid } from "uuid";
import { useLocation } from 'react-router-dom';
import { getToken } from '../../utils/getToken';
import { getUser } from '../../utils/getUser';

interface ISocketMessage{
    userId: string; //socket uuid
    message: {
        conversationId: string, 
        text: string, 
        authorNickname: string
    }
}

const ChatComponent = ({socket}: any) => {
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState<ISocketMessage["message"][]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [messageBar, setMessageBar] = useState({show: false, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"});
    const [currentConversation, setCurrentConversation] = useState<any>(null);

    const location = useLocation();
    const contactId = location.pathname.slice(location.pathname.lastIndexOf('/')+1, location.pathname.length)
    const userData = getUser();
    
    React.useEffect(() => {
        socket.on("receiveMessage", (message: ISocketMessage) => {
            console.log('messsage')
            setMessages(prevMessages => [...prevMessages, message.message]);
        })

        fetch(`http://localhost:3000/conversation/${contactId}`, 
            { headers: { Authorization: getToken() } 
        }).then(resp => {
            return resp.json()
        }).then(data => {
            setMessages(data.messages)
            setLoadingMessages(false)
            setCurrentConversation(data)
        }).catch(err => {
            console.log(err)
            setLoadingMessages(false)
            setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"})
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [])

    React.useEffect(() => {
        if(!loadingMessages){
            socket.emit('join', { conversationId: currentConversation._id });
        }
    }, [loadingMessages])

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message = {
            conversationId: currentConversation._id,
            text: newMessage,
            authorNickname: userData.nickname,
            messageId: uuid
        };

        socket.emit("message", message)
        setNewMessage('');
    };

    return (
        <div className={styles.container}>
            {
                loadingMessages ? <Spinner size={SpinnerSize.large} /> : (
                    <>
                    { messageBar.show &&
                        <>
                            <div style={{marginTop: "10px"}}></div>
                            <MessageBar messageBarType={messageBar.type}>
                                {messageBar.text}
                            </MessageBar> 
                        </>
                    }
                    <div className={styles.messagesContainer}>
                        {
                            messages.map((msg, id) => {
                                const isSelf = msg.authorNickname === userData.nickname;
                                return (
                                    <div key={id} className={styles.messageWrapper} style={isSelf ? { justifyContent: "flex-end" } : { justifyContent: "flex-start"} } >
                                        <div className={styles.message} style={isSelf ? { backgroundColor: "lightblue" } : { backgroundColor: "lightcoral" }}>
                                            <div className={styles.messageInfoContainer}>
                                                <h3>{msg.authorNickname}</h3>
                                                <h3>12th Jan 9:03 am</h3>
                                            </div>
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.inputContainer}>
                        <TextField
                            value={newMessage}
                            onChange={(_, newValue) => setNewMessage(newValue || '')}
                            placeholder="Type a message..."
                            className={styles.inputField}
                        />
                        <PrimaryButton text="Send" onClick={handleSendMessage} />
                    </div>
                    {messages.length === 0 && <div className={styles.noMessages}>No messages have been sent yet</div>}
                    </>
                )
            }
        </div>
    );
};

export default ChatComponent;