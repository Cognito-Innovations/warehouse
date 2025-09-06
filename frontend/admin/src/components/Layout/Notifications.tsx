import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Badge, 
  IconButton, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  ClickAwayListener
} from '@mui/material';
import { NotificationsOutlined as NotificationIcon, Circle as CircleIcon } from '@mui/icons-material';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const Notifications: React.FC = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Package Arrived',
      message: 'Package #12345 has been received and is ready for processing',
      time: '2 minutes ago',
      isRead: false
    },
    {
      id: '2',
      title: 'Inventory Update',
      message: 'Low stock alert for item SKU-789',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance completed successfully',
      time: '3 hours ago',
      isRead: true
    }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  const handleNotificationClick = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleClickAway = () => {
    setNotificationsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Box sx={{ position: 'relative', border: '2px solid grey', borderRadius: '50%' }}>
      <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
        <IconButton onClick={handleNotificationClick} size="small" sx={{ p: 0.5 }}>
          <NotificationIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Badge>
      {/* Notification Dropdown */}
      {notificationsOpen && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper 
            ref={notificationRef} 
            sx={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              mt: 1, 
              width: 320, 
              maxHeight: 400, 
              overflow: 'auto', 
              zIndex: 1000, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
              border: '1px solid #e2e8f0'
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              {/* TODO: Uncomment this when fully notifications is implemented */}
              {/* <Typography variant="body2" color="text.secondary">
                {unreadCount} unread
              </Typography> */}
            </Box>
            
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem sx={{ px: 2, py: 1.5, '&:hover': { bgcolor: '#f8fafc' }, cursor: 'pointer'}}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CircleIcon sx={{ fontSize: 8, color: notification.isRead ? 'transparent' : '#ef4444' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: notification.isRead ? 400 : 600, color: notification.isRead ? 'text.secondary' : 'text.primary'}}>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && (
                    <Divider sx={{ mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
            
            {notifications.length > 0 && (
              <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                <Typography variant="body2" color="primary" sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { textDecoration: 'underline' }}}>
                  View all notifications
                </Typography>
              </Box>
            )}
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default Notifications;
