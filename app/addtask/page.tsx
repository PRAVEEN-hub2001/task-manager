'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, Button, Card, CardContent, Divider, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { AddTaskHandle } from '@/redux/slices/taskSlice';
import { useRouter } from 'next/navigation';

const Addtask = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState({ status: false, severity: '', message: '' })
    const ClearError = () => {
        setTimeout(() => {
            setError({ status: false, severity: '', message: '' })
        }, 5000)
    }
    const handleAddTask = async () => {
        if (!title.trim() || !description.trim()) {
            setError({ status: true, severity: 'warning', message: 'Title and Description is required.' });
            ClearError();
            return
        }
        try {
            const res = await axios.post('/api/tasks', { title, description });
            const task = await res.data;
            if (!task) {
                throw new Error('Failed to Add Task Info.');
            }
            setError({ status: true, severity: 'success', message: 'Task info Added Successfully.' });
            ClearError();
            dispatch(AddTaskHandle(task));
        }
        catch (err) {
            console.log(err);
            setError({ status: true, severity: 'error', message: 'Failed to Add Task Info.' });
            ClearError();
        }

    };

    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" align='center'>
                    Add Task
                </Typography>
                <Divider></Divider>
                <div style={{ display: 'flex', justifyContent: 'end', margin: '10px 0' }}> <Button variant="contained" onClick={() => {
                    router.push('/');
                }}>Go to List</Button></div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: '0 20%' }}>
                    <TextField id="filled-basic" label="Title" variant="filled" style={{ padding: '15px 0' }} value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <TextField id="filled-basic" label="Description" variant="filled" multiline rows={4} style={{ padding: '0 0 15px 0' }} value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <Button variant="contained" onClick={handleAddTask}>ADD</Button>
                    {error.status && <Alert variant="outlined" severity={error.severity} style={{ margin: '10px 0 0 0' }} >
                        {error.message}
                    </Alert>}
                </div>
            </CardContent>
        </Card>
    );
};

export default Addtask;
