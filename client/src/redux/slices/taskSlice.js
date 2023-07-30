import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],

  reducers: {
  

    updateTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;

      return state.map((task) =>
        task._id === taskId ? { ...task, status } : task
      );
    },
  },
});

export const { updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;
