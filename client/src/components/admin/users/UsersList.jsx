import React, { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Paper,
    IconButton,
    Chip,
    TextField,
    MenuItem,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { 
    Edit, 
    Delete, 
    Check, 
    Block,
    Search
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import userService from '../../../services/userService';
import UserForm from './UserForm';

const roleColors = {
    admin: 'bg-red-500',
    sales: 'bg-blue-500',
    user: 'bg-green-500'
};

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        status: 'all'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await userService.getUsers(filters);
            if (response.success) {
                setUsers(response.users);
            } else {
                setError('Failed to load users');
            }
        } catch (err) {
            console.error('Failed to load users:', err);
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredUsers = users.filter(user => {
        return (
            (filters.search === '' || 
                user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.role === 'all' || user.role === filters.role) &&
            (filters.status === 'all' || user.status === filters.status)
        );
    });

    const handleAddUser = () => {
        setSelectedUser(null);
        setShowForm(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowForm(true);
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setOpenDialog(true);
    };

    const confirmDeleteUser = async () => {
        if (userToDelete) {
            try {
                setLoading(true);
                const response = await userService.deleteUser(userToDelete.id);
                if (response.success) {
                    await loadUsers(); // Reload the list
                } else {
                    setError('Failed to delete user');
                }
            } catch (error) {
                console.error('Failed to delete user:', error);
                setError(error.message || 'Failed to delete user');
            } finally {
                setLoading(false);
                setOpenDialog(false);
                setUserToDelete(null);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-primary">Users Management</h1>
                <Button variant="primary" onClick={handleAddUser}>
                    Add New User
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search users..."
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: <Search className="mr-2 text-text-primary/50" />
                    }}
                    className="bg-background-light/30"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'rgba(224, 224, 224, 0.2)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(224, 224, 224, 0.4)',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'rgba(224, 224, 224, 0.7)',
                        },
                        '& .MuiInputBase-input': {
                            color: 'rgb(224, 224, 224)',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'rgba(224, 224, 224, 0.5)',
                            opacity: 1
                        },
                    }}
                />

                <TextField
                    select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    variant="outlined"
                    fullWidth
                    className="bg-background-light/30"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'rgba(224, 224, 224, 0.2)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(224, 224, 224, 0.4)',
                            },
                        },
                        '& .MuiSelect-select': {
                            color: 'rgb(224, 224, 224)',
                        },
                        '& .MuiInputLabel-root': {
                            color: 'rgba(224, 224, 224, 0.7)',
                        },
                    }}
                >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                </TextField>

                <TextField
                    select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    variant="outlined"
                    fullWidth
                    className="bg-background-light/30"
                    sx={{ /* Add MUI styles */ }}
                >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <TableContainer component={Paper} className="bg-background-light">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="text-text-primary">Name</TableCell>
                                <TableCell className="text-text-primary">Email</TableCell>
                                <TableCell className="text-text-primary">Role</TableCell>
                                <TableCell className="text-text-primary">Status</TableCell>
                                <TableCell className="text-text-primary">Last Login</TableCell>
                                <TableCell className="text-text-primary">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-background-dark/50"
                                >
                                    <TableCell className="text-text-primary">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="text-text-primary">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role}
                                            className={`${roleColors[user.role]} text-white`}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {user.status === 'active' ? (
                                            <Check className="text-green-500" />
                                        ) : (
                                            <Block className="text-red-500" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-text-primary">
                                        {new Date(user.lastLogin).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <IconButton 
                                                size="small" 
                                                className="text-blue-500"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                className="text-red-500"
                                                onClick={() => handleDeleteUser(user)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <UserForm
                open={showForm}
                onClose={() => setShowForm(false)}
                user={selectedUser}
                onSuccess={loadUsers}
            />

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteUser} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}
        </div>
    );
};

export default UsersList; 