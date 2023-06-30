const Project = require("../model/Project");

const viewAllProject = async (req, res) => {
  try {
    const project = await Project.find().populate("assigned_to");
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
      description
    } = req.body;
    const existingProject = await Project.findOne({
      project_name: project_name,
      assigned_to: assigned_to,
    });
    if (existingProject) {
      return res.status(409).json({ message: "Project Exists" });
    }
    const filepath = req.file.path.replace(/\\/g, '/').slice(7);
    const project = new Project({
      project_name:project_name,
      assigned_to:assigned_to,
      starting_time:starting_time,
      deadline:deadline,
      priority:priority,
      status:status,
      description:description,
      attachment:filepath
    });
    await project.save()
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Unable to add Project" });
  }
};
const viewTeamleadProject = async(req,res) =>{
  try {
      const employee = req.employee;
      const project = await Project.find({assigned_to:employee._id}).populate('assigned_to')
      if (project) {
        res.status(200).json({ project });
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    
  } catch (error) {
    
  }
}

module.exports = {
  viewAllProject,
  addProject,
  viewTeamleadProject
};
