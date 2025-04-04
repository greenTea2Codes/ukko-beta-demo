import { Box } from "@mui/material";
import MinimalChatInput from "./MinimalChatInput";
import { useState } from "react";
import ChatMessages from "./ChatMessages";

const Chat = ({ location }) => {
    const [ messages, setMessages ] = useState([]);
    const [ isWaitingResponse, setIsWaitingResponse ] = useState(false);
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh"
        }}>
            <Box sx={{
                flexGrow: 1,
                overflowY: "auto",
                padding: 2
            }}>
                <ChatMessages messages={ messages } isWaiting={ isWaitingResponse }/>
            </Box>
            <Box sx={{
                padding: 2,
                borderTop: "1px solid #ddd"
            }}>
                <MinimalChatInput updateMessages={ setMessages } location={ location } setIsWaiting={ setIsWaitingResponse } />
            </Box>
        </Box>
    );
};

export default Chat;