import { Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useRef } from "react";

const ChatMessages = ({ messages, isWaiting }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: 2 }}>
            { messages.map(( msg, index ) => (
                <Box key={ index } sx={{ marginBottom: 1, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.content}
                </Box>
            ))}
            { isWaiting && 
                <Box>      
                    <CircularProgress size="1rem"/>
                </Box> }
            <Box ref={ bottomRef }/>
        </Box>
    );
};
export default ChatMessages;