const Project = require("../model/Project");


const viewAllProject = async (req, res) => {
  try {
    const project = await Project.find().populate("assigned_to task.assigned_to");
    if (project) {
      res.status(200).json({ project });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const addProject = async (req, res) => {
  try {
    const {
      project_name,
      assigned_to,
      starting_time,
      deadline,
      priority,
      status,
      description,
    } = req.body;
    const existingProject = await Project.findOne({
      project_name: project_name,
      assigned_to: assigned_to,
    });
    if (existingProject) {
      return res.status(409).json({ message: "Project Exists" });
    }
    const filepath = req.file.path.replace(/\\/g, "/").slice(7);
    const project = new Project({
      project_name: project_name,
      assigned_to: assigned_to,
      starting_time: starting_time,
      deadline: deadline,
      priority: priority,
      status: status,
      description: description,
      attachment: filepath,
    });
    await project.save();
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Unable to add Project" });
  }
};
const viewTeamleadProject = async (req, res) => {
  try {
    const employee = req.employee;
    const project = await Project.find({ assigned_to: employee._id }).populate(
      "assigned_to"
    );
    if (project) {
      res.status(200).json({ project });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
const editProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const project = await Project.findById({ _id: projectId });
    if (project) {
      res.status(200).json({ project });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const {
      project_name,
      assigned_to,
      starting_time,
      deadline,
      priority,
      status,
      description,
    } = req.body;
    let attachment = req.file;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.project_name = project_name
    project.assigned_to = assigned_to;
    project.starting_time = starting_time;
    project.deadline = deadline;
    project.priority = priority;
    project.status = status;
    project.description = description;

    if (attachment) {
      project.attachment = attachment.filename;
    }
    const updatedProject = await project.save();

    res.status(200).json({ project: updatedProject });
  } catch (error) {}
};
const addTask = async (req, res) => {
  try {
    const {
      title,
      project_id,
      description,
      starting_date,
      due_date,
      assigned_to,
      priority,
    } = req.body;

    // Check if the task already exists in the project
    const existingTask = await Project.findOne({
      'task.title': title,
      _id: project_id
    });
    

    if (existingTask) {
      return res.status(409).json({ message: 'Task exists' });
    }

    // Create a new task object
    const task = {
      title,
      description,
      starting_date,
      due_date,
      assigned_to,
      priority,
      status: 'todo' // Set the initial status to 'todo'
    };
    console.log(task)

    const updatedProject = await Project.findByIdAndUpdate(
      project_id,
      { $push: { task: task } },
      { new: true }
    );
console.log(updateProject)
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(201).json({ task: updatedProject.task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Unable to add task' });
  }
};

const viewTask = async (req, res) => {
  try {
    const id = req.query.id;
    const project = await Project.findById(id).populate('assigned_to task.assigned_to');
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = project.task;
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { task_id, status } = req.body;
    console.log(req.body)
    const updatedTask = await Project.findOneAndUpdate(
      { "task._id": task_id },
      { $set: { "task.$.status": status } },
      { new: true }
    );
    
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.log("Error updating task status:", error);
    res.status(500).json({ error: "An error occurred while updating task status" });
  }
};

module.exports = {
  viewAllProject,
  addProject,
  viewTeamleadProject,
  editProject,
  updateProject,
  addTask,
  viewTask,
  updateStatus
};
