import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Chat from "../components/Chat";
import Menu from "../components/Menu";
import LocationModal from "../components/LocationModal";

const ChatView = () => {
    const [location, setLocation] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const savedLocation = sessionStorage.getItem("selectedLocation");
        if (savedLocation) {
            setLocation(savedLocation);
        } else {
            setShowModal(true);
        }
    }, []);

    const handleLocationSave = (selectedLocation) => {
        setLocation(selectedLocation);
        setShowModal(false);
    };

    return (
        <>
        <Grid container spacing={1}>
            <Grid size={{xs:12, sm:3}}>
                <Menu location={ location } onChangeLocation={() => setShowModal(true)}/>
            </Grid>
            <Grid size={{xs:12, sm:6}}>
                <Chat location={ location }/>
            </Grid>
        </Grid>   
        {showModal && <LocationModal onSave={ handleLocationSave }/>}        
        </>
         
    );
};
export default ChatView;