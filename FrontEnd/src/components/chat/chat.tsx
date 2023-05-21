import React, { useState } from 'react';
import { List, TextField, PrimaryButton, MessageBarType, MessageBar, Spinner, SpinnerSize } from '@fluentui/react';
import { v4 as uuid } from 'uuid';
import styles from './chat.module.css';
import { useLocation } from 'react-router-dom';
import { getToken } from '../../utils/getToken';

const ChatComponent: React.FC = () => {
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [messageBar, setMessageBar] = useState({show: false, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"});
    
    const location = useLocation();
    const contactId = location.pathname.slice(location.pathname.lastIndexOf('/')+1, location.pathname.length)
    
    React.useEffect(() => {
        fetch(`http://localhost:3000/conversation/${contactId}`, 
            { headers: { Authorization: getToken() } 
        }).then(resp => {
            return resp.json()
        }).then(data => {
            console.log(data)
            setMessages(data.messages)
            setLoadingMessages(false)
        }).catch(err => {
            console.log(err)
            setLoadingMessages(false)
            setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"})
        });
    }, [])

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message = {
            id: uuid(),
            content: newMessage.trim(),
            author: 'User',
        };

        setMessages(prevMessages => [...prevMessages, message]);
        setNewMessage('');
    };

    const renderMessage = (item: any) => {
        return (
        <div className={styles.message}>
            <b>{item.author}: </b>
            {item.content}
        </div>
        );
    };

    if(loadingMessages) 
        return <Spinner size={SpinnerSize.large} />

    return (
        <div className={styles.container}>
            { messageBar.show &&
                <>
                    <div style={{marginTop: "10px"}}></div>
                    <MessageBar messageBarType={messageBar.type}>
                        {messageBar.text}
                    </MessageBar> 
                </>
            }
            <List items={messages} onRenderCell={renderMessage} />
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
        </div>
    );
};

export default ChatComponent;
