import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskState {
  value: any;
}

const initialState: TaskState = {
  value: [],
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    AddTaskHandle: (state, action: PayloadAction<any>) => {
      state.value = [...state.value, action.payload]
    },
    UpdateStatusHandle: (state, action: PayloadAction<any>) => {
      state.value = state.value.map((task: any) =>
        task._id === action.payload.id
          ? { ...task, status: action.payload.status }
          : task
      );
    },
    DeleteHandle: (state, action: PayloadAction<any>) => {
      state.value = state.value.filter(task => task._id !== action.payload);
      console.log(state.value)
    },
    ListHandle: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    }
  }
});

export const { AddTaskHandle, UpdateStatusHandle, DeleteHandle, ListHandle } = taskSlice.actions;
export default taskSlice.reducer;
