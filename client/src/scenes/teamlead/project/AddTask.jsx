import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AddTask = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Simulating API fetch
    const fetchTasks = async () => {
      // Sample tasks data
      const sampleTasks = [
        { id: '1', title: 'Task 1', description: 'Description 1', details: 'More details 1', status: 'todo' },
        { id: '2', title: 'Task 2', description: 'Description 2', details: 'More details 2', status: 'todo' },
        { id: '3', title: 'Task 3', description: 'Description 3', details: 'More details 3', status: 'todo' },
      ];

      setTasks(sampleTasks);
    };

    fetchTasks();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId.split('-')[1];
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">To Do</Typography>
            <Droppable droppableId="column-todo">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks
                    .filter((task) => task.status === 'todo')
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card sx={{ mb: 2 }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {task.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {task.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {task.details}
                                </Typography>
                               
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Ongoing</Typography>
            <Droppable droppableId="column-ongoing">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks
                    .filter((task) => task.status === 'ongoing')
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card sx={{ mb: 2 }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {task.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {task.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {task.details}
                                </Typography>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Complete</Typography>
            <Droppable droppableId="column-complete">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks
                    .filter((task) => task.status === 'complete')
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card sx={{ mb: 2 }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {task.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {task.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {task.details}
                                </Typography>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Paper>
        </Grid>
      </Grid>
    </DragDropContext>
  );
};

export default AddTask;
