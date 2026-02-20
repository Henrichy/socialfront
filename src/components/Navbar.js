import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SupportIcon from '@mui/icons-material/Support';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Badge } from '@mui/material';
import logo from '../accvaultlogo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const cartItemsCount = getCartItemsCount();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'dashboard', icon: <ShoppingCartIcon />, path: '/marketplace' },
    { text: 'Add Funds', icon: <AccountBalanceWalletIcon />, path: '/add-funds' },
    { text: 'Support', icon: <SupportIcon />, path: '/support' },
    { text: 'Guidelines', icon: <AssignmentIcon />, path: '/guidelines' },
    { text: 'WhatsApp Community', icon: <WhatsAppIcon />, path: 'https://chat.whatsapp.com/DUx6ttrlnW6Bt4aXoImIBs', external: true },
    { text: 'Cart', icon: <ShoppingCartIcon />, path: '/cart', badge: cartItemsCount },
  ];

  if (!user) {
    menuItems.push(
      { text: 'Login', icon: <LoginIcon />, path: '/login' },
      { text: 'Register', icon: <PersonAddIcon />, path: '/register' }
    );
  }

  if (user?.role === 'admin') {
    menuItems.splice(6, 0, { text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/admin' });
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#7c3aed' }}>
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Box
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <img 
              src={logo} 
              alt="ACCVAULTNG Logo" 
              style={{
                height: isMobile ? '58px' : '90px',
                width: 'auto',
                // filter: 'brightness(0) invert(1)' // Makes the logo white to match the navbar
              }}
            />
          </Box>

          {isMobile ? (
            // Mobile Menu
            <>
              {/* Cart Icon for Mobile */}
              <IconButton
                color="inherit"
                component={Link}
                to="/cart"
                sx={{ color: 'white', mr: 1 }}
              >
                <Badge badgeContent={cartItemsCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {user && (
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'white', color: '#7c3aed' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              )}
              
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuToggle}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            // Desktop Menu
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                color="inherit"
                component={Link}
                to="/marketplace"
                sx={{ color: 'white' }}
              >
                Dashboard
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/add-funds"
                startIcon={<AccountBalanceWalletIcon />}
                sx={{ color: 'white' }}
              >
                Add Funds
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/support"
                sx={{ color: 'white' }}
              >
                Support
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/guidelines"
                sx={{ color: 'white' }}
              >
                Guidelines
              </Button>

              <Button
                color="inherit"
                href="https://chat.whatsapp.com/DUx6ttrlnW6Bt4aXoImIBs"
                target="_blank"
                startIcon={<WhatsAppIcon />}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 211, 102, 0.2)'
                  }
                }}
              >
                Community
              </Button>

              {/* Cart Icon */}
              <IconButton
                color="inherit"
                component={Link}
                to="/cart"
                sx={{ color: 'white' }}
              >
                <Badge badgeContent={cartItemsCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Button
                      color="inherit"
                      component={Link}
                      to="/admin"
                      startIcon={<AdminPanelSettingsIcon />}
                      sx={{ color: 'white' }}
                    >
                      Admin
                    </Button>
                  )}
                  
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'white', color: '#7c3aed' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={{ color: 'white' }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/register"
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* User Menu */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#f8fafc'
          }
        }}
      >
        <Box sx={{ pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={item.external ? 'a' : Link}
                to={item.external ? undefined : item.path}
                href={item.external ? item.path : undefined}
                target={item.external ? '_blank' : undefined}
                onClick={handleMobileMenuToggle}
                sx={{
                  backgroundColor: item.highlight ? 'rgba(37, 211, 102, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: item.text === 'WhatsApp Community' || item.highlight
                      ? 'rgba(37, 211, 102, 0.2)' 
                      : 'rgba(124, 58, 237, 0.1)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: item.text === 'WhatsApp Community' || item.highlight ? '#25D366' : '#7c3aed' 
                }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: item.text === 'WhatsApp Community' || item.highlight ? '#25D366' : '#7c3aed',
                      fontWeight: item.highlight ? 600 : 500
                    } 
                  }} 
                />
                {item.highlight && (
                  <Chip 
                    label="Active" 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#25D366', 
                      color: 'white',
                      fontSize: '0.7rem'
                    }} 
                  />
                )}
              </ListItem>
            ))}
            
            
            {user && (
              <ListItem
                button
                onClick={() => {
                  handleLogout();
                  handleMobileMenuToggle();
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(220, 38, 38, 0.1)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#dc2626' }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: '#dc2626',
                      fontWeight: 500
                    } 
                  }} 
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;