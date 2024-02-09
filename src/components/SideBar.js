import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import InventoryIcon from '@mui/icons-material/Inventory';
import SellIcon from '@mui/icons-material/Sell';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Typography, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';


export default function SideMenu({ open, setOpen, user }) {

    const toggleDrawer = (open) => (event) => { // use a single function for toggling the drawer
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(open); // set the state to the open parameter
    };

    const iconColor = "#D5D507"

    const menuLinks = [
        '/products',
        '/facets',
        '/variation-themes',
        '/categories',
        '/events',
        '/synonyms'
    ];

    const menuIcons = [
        <InventoryIcon sx={{ color: iconColor }} />,
        <SellIcon sx={{ color: iconColor }} />,
        <FilterAltOutlinedIcon sx={{ color: iconColor }} />,
        <CategoryOutlinedIcon sx={{ color: iconColor }} />,
        <EventAvailableOutlinedIcon sx={{ color: iconColor }} />,
        <CompareArrowsIcon sx={{color: iconColor}} />
    ];

    const menuItems = ['Products', 'Facets', 'Variation Theme Templates',
                         'Categories', 'Events', 'Synonyms'];

    const list = () => ( // use a single list component for the drawer content
        <Box
            sx={{ width: 250 }} // set a fixed width for the drawer
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuItems.map((text, index) => (
                    <Link key={text} to={menuLinks[index]} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                        <ListItem  disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {menuIcons[index]}
                                </ListItemIcon>
                                <ListItemText sx={{ color: iconColor }} primary={text} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
            >
                <Box sx={{ px: 2, pt: 1 }} display="flex">
                    <Box sx={{ flexGrow: 1 }}>
                        <img style={{ height: "70px", width: "120px" }} src="/smile_sales_logo_dark_theme.svg" alt="image" />
                    </Box>
                    <Box display={'flex'} alignItems={"center"} justifyContent={"center"}>
                        <IconButton onClick={toggleDrawer(false)}>
                            <HighlightOffIcon fontSize='large' sx={{ color: "#D5D507" }} />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ px: 2, pt: 1 }} display="flex">
                    <Box sx={{ mr: 2 }}>
                        <Avatar alt={`${user.first_name} ${user.last_name}`} src="/static/images/avatar/1.jpg" sx={{ backgroundColor: "#D5D507" }} />
                    </Box>
                    <Box>
                        <Typography variant='subtitle2'>
                            {`${user.first_name} ${user.last_name}`}
                        </Typography>
                        <Typography variant='caption'>
                            {`${user.email}`}
                        </Typography>
                    </Box>
                </Box>
                {list()}
            </Drawer>
        </div>
    );
}