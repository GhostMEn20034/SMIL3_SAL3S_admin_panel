import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SideMenu from './SideBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useUserInfo from '../utils/useUserInfo';


export default function AppBarMenu() {

    const [openSideBar, setOpenSideBar] = React.useState(false);

    const {userInfo} = useUserInfo();

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#FC7DF3',
            },
        },
    });

    return (
        <>
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setOpenSideBar(true)}
                        >
                            <MenuIcon sx={{color: "#D5D507"}}/>
                        </IconButton>
                        <Box sx={{ mr: 3 }}>
                            <img style={{ height: "70px", width: "120px" }} src="/smile_sales_logo_dark_theme.svg" alt="image" />
                        </Box>
                        <Typography variant="h6" color={"#D5D507"} component="div" sx={{ flexGrow: 1 }}>
                            Smile Sales Admin Menu
                        </Typography>
                    </Toolbar>
                </AppBar>
                {userInfo && (
                    <SideMenu open={openSideBar} setOpen={setOpenSideBar} user={userInfo} />
                )}
            </Box>
        </ThemeProvider>
        </>
    );
}
