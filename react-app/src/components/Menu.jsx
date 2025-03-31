import { Box, Button } from "@mui/material";

const Menu = ({ location, onChangeLocation }) => {
    return(
        <Box sx={{textAlign: "center"}}>
            <Box>
                <h1 style={{ marginBottom: 0 }}>Ukko Beta</h1>
                <p>A weather bot powered by a small language model</p>
            </Box>
            <Box sx={{ marginTop: "2rem"}}>
                <p>You are in {location || "an unknown location"}</p>
            </Box>
            <Box>
                <Button variant = "outlined" size="small" onClick={ onChangeLocation }>
                    Change Location
                </Button>
            </Box>        
        </Box>
    );
};
export default Menu;