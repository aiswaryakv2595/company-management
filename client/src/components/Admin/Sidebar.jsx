import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  ThemeProvider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../FlexBetween";
import {
  ChevronLeft,
  ExpandMoreOutlined,
  ExpandLessOutlined,
} from "@mui/icons-material";

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
  navItems,
  userRole,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const [expandedItems, setExpandedItems] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const getSidebarBackground = () => {
    if (userRole === "admin") {
      return "#34444C";
    } else if (userRole === "employee") {
      return "#004E92";
    } else if (userRole === "teamlead") {
      return "#212a3e";
    }
    // Add more conditions for other user roles if needed
    return "";
  };

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleToggleExpand = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const isItemExpanded = (index) => {
    return expandedItems.includes(index);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box component="nav">
        {isSidebarOpen && (
          <Drawer
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            variant="persistent"
            anchor="left"
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": {
                color: theme.palette.common.white,
                backgroundColor: "#212a3e", //apply it to theme
                boxSizing: "border-box",
                borderWidth: isNonMobile ? 0 : "2px",
                width: drawerWidth,
              },
            }}
          >
            <Box width="100%">
              <Box m="2rem 1rem 1rem 1.5rem">
                <FlexBetween color={theme.palette.secondary.main}>
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Typography variant="h4" fontWeight="bold">
                      CMS
                    </Typography>
                  </Box>
                  {!isNonMobile && (
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                      <ChevronLeft />
                    </IconButton>
                  )}
                </FlexBetween>
              </Box>
              <List>
                {navItems.map((item, index) => {
                  const { route, text, icon, subItems } = item;
                  const lcText = text.toLowerCase();
                  const isExpanded = isItemExpanded(index);

                  return (
                    <React.Fragment key={text}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            if (subItems.length > 0) {
                              handleToggleExpand(index);
                            } else {
                              navigate(`/${route}`);
                              setActive(lcText);
                            }
                          }}
                          sx={{
                            backgroundColor: active === route ? "#a1dbec" : "",
                            color: active === route ? theme.palette.primary[600] : theme.palette.common.white,
                          }}
                        >
                          {icon && (
                            <ListItemIcon
                              sx={{
                                ml: "2rem",
                                color: active === route ? theme.palette.primary[600] : theme.palette.common.white,
                              }}
                            >
                              {icon}
                            </ListItemIcon>
                          )}
                          <ListItemText primary={text} />

                          {subItems.length > 0 && (
                            <ListItemIcon
                              sx={{
                                ml: "auto",
                                color: active === lcText ? theme.palette.primary[600] : theme.palette.common.white,
                              }}
                            >
                              {isExpanded ? (
                                <ExpandLessOutlined />
                              ) : (
                                <ExpandMoreOutlined />
                              )}
                            </ListItemIcon>
                          )}
                        </ListItemButton>
                      </ListItem>
                      {isExpanded && (
                        <List component="div" disablePadding>
                          {subItems.map((subItem) => (
                            <ListItem
                              key={subItem.text}
                              disablePadding
                              sx={{ pl: "1rem" }}
                            >
                              <ListItemButton
                                onClick={() => {
                                  navigate(`/${subItem.route}`);
                                  setActive(subItem.route);
                                }}
                                sx={{
                                  backgroundColor: active === subItem.route ? "#a1dbec" : "",
                                  color: active === subItem.route ? theme.palette.primary[600] : theme.palette.common.white,
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    ml: "1rem",
                                    color: active === subItem.route ? theme.palette.primary[600] : theme.palette.common.white,
                                  }}
                                >
                                  {subItem.icon}
                                </ListItemIcon>
                                <ListItemText primary={subItem.text} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          </Drawer>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;
