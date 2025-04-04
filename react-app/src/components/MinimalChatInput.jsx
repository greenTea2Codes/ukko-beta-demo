import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";

const MinimalChatInput = ({ updateMessages, location, setIsWaiting }) => {
    const [userInput, setUserInput] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    const handleUserInput = event => {
        setUserInput(event.target.value);
    };

    const handleUserSubmit = event => {
        event.preventDefault();
        if (!userInput) {
            return
        }
        setIsSendingMessage(true);
        const userMessage = { role: 'user', content: userInput };
        updateMessages(prev => [...prev, userMessage]);

        const requestBody = {
            message: userInput,
            location: location
        };

        const backendEndpoint = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/chat";

        setIsWaiting(true);
        axios.post(backendEndpoint, requestBody).then(res => {
            const assistantMsg = {role: 'assistant', content: res.data.response.content};
            updateMessages(prev => [...prev, assistantMsg]);
            setIsSendingMessage(false);
            setIsWaiting(false);
            setUserInput('');
        }).catch(err => {
            console.log(err);
            const errMsg = {role: 'assistant', content: err.message};
            updateMessages(prev => [...prev, errMsg]);
            setIsSendingMessage(false);
            setIsWaiting(false);
            setUserInput('');
        });
    };

    return(
        <form onSubmit={ handleUserSubmit }>
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" flexWrap="nowrap">
                <TextField
                    id="outlined-multiline-static"
                    label="Ask a question related to the weather"
                    multiline
                    value={ userInput }
                    onChange={ handleUserInput }
                    maxRows={4}
                    style={{flex: 1}}
                    disabled={ isSendingMessage }
                ></TextField>
                <Button
                    variant="contained"
                    type="submit"
                    value="Submit"
                    style={{marginLeft: 10}}
                    disabled={ !userInput || isSendingMessage || !location }
                >Send</Button>
            </Box>
        </form>        
    );
};

export default MinimalChatInput;