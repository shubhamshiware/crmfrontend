import SettingsIcon from "@mui/icons-material/Settings";

<ListItem
  button
  sx={{
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  }}
>
  <ListItemIcon sx={{ color: "#fff" }}>
    <SettingsIcon />
  </ListItemIcon>
  <ListItemText primary="Settings" />
</ListItem>;
// import React from "react";
// import { Drawer, List, ListItem, ListItemText } from "@mui/material";

// const Sidebar = ({ isOpen, onClose }) => {
//   return (
//     <Drawer anchor="left" open={isOpen} onClose={onClose}>
//       <List>
//         <ListItem button onClick={onClose}>
//           <ListItemText primary="Dashboard" />
//         </ListItem>
//         <ListItem button onClick={onClose}>
//           <ListItemText primary="Orders" />
//         </ListItem>
//         <ListItem button onClick={onClose}>
//           <ListItemText primary="Clients" />
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;
