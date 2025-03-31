import { Box } from "@mui/material";
import MinimalChatInput from "./MinimalChatInput";
import { useState } from "react";
import ChatMessages from "./ChatMessages";

const Chat = ({ location }) => {
    const [ messages, setMessages ] = useState([]);
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
                <ChatMessages messages={ messages }/>
            </Box>
            <Box sx={{
                padding: 2,
                borderTop: "1px solid #ddd"
            }}>
                <MinimalChatInput updateMessages={ setMessages } location={ location } />
            </Box>
        </Box>
    );
};

export default Chat;