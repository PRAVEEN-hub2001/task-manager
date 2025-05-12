'use client';
import { useState, useEffect } from 'react';
import { Button, Card, CardContent, FormControl, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { DeleteHandle, ListHandle, UpdateStatusHandle } from '@/redux/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: boolean;
}

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const tasklist = useSelector((state: { tasks: { value: { id: string; status: boolean }[] } }) => state.tasks.value);
  const [tasks, setTasks] = useState(tasklist);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (filter === 'completed')
      setTasks((tasklist) => tasklist.filter((task) => task.status));
    else if (filter === 'pending')
      setTasks((tasklist) => tasklist.filter((task) => !task.status));
    else
      setTasks(tasklist);
  }, [filter, tasklist]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        const data = await res.data;
        dispatch(ListHandle(data));
        setTasks(data)
      }
      catch (err) {
        console.error(err);
      }
    }
    fetchTasks();
  }, []);



  const handleStatus = async (id: string) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, { status: true });
      const task = await res.data;
      if (!task) {
        throw new Error('Failed to Update Task Info.');
      }
      dispatch(UpdateStatusHandle({ id, status: true }));
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await axios.delete(`/api/tasks/${id}`);
      const task = await res.data;
      if (!task) {
        throw new Error('Failed to Delete Task Info.');
      }
      dispatch(DeleteHandle(id));
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <Card >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" align='center'>
          Task Manager
        </Typography>
        <Divider></Divider>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              label="Filter"
              onChange={(e) => {
                setFilter(e.target.value);
              }
              }
            >
              <MenuItem value={'all'}>All</MenuItem>
              <MenuItem value={'pending'}>Pending</MenuItem>
              <MenuItem value={'completed'}>Completed</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => {
            router.push('/addtask');
          }}>Add Task</Button></div>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {task.title}
                </TableCell>
                <TableCell >{task.description}</TableCell>
                <TableCell align="right"><Button variant="contained" disabled={task.status} onClick={() => { handleStatus(task._id) }}>
                  {task.status ? 'Completed' : 'Mark as Completed'}
                </Button></TableCell>
                <TableCell align="right"><Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => { handleDeleteTask(task._id) }}>
                  Delete
                </Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
