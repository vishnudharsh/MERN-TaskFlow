// src/assets/data.js

export const summary = {
  totalTasks: 10,
  last10Task: [
    {
      _id: "65c5f12ab5204a81bde866a9",
      title: "Test task",
      date: "2024-02-09T00:00:00.000Z",
      priority: "high",
      stage: "todo",
      assets: [
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707470001.png",
      ],
      team: [
        {
          _id: "65c202d4aa62f32ffd1303cc",
          name: "Codewave Asante",
          title: "Administrator",
          role: "Admin",
          email: "admin@gmail.com",
        },
        {
          _id: "65c30b96e639681a13def0b5",
          name: "Jane Smith",
          title: "Product Manager",
          role: "Manager",
          email: "jane@company.com",
        },
      ],
    },
    {
      _id: "65c6000ab5204a81bd1111b2",
      title: "Integrate Tasks API",
      date: "2024-02-10T00:00:00.000Z",
      priority: "high",
      stage: "in progress",
      assets: [],
      team: [
        { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave Asante", role: "Admin" },
        { _id: "65c3176a0fd860f958baa099", name: "Emily Wilson", role: "Analyst" },
      ],
    },
    {
      _id: "65c5d547660756f6fd453a7a",
      title: "Duplicate – Review Code Changes",
      date: "2024-02-11T00:00:00.000Z",
      priority: "medium",
      stage: "todo",
      assets: [],
      team: [{ _id: "65c317360fd860f958baa08e", name: "Alex Johnson", role: "Designer" }],
    },
    {
      _id: "65c5e12ab5204a81bd1111a1",
      title: "Implement Sidebar Navigation",
      date: "2024-02-12T00:00:00.000Z",
      priority: "low",
      stage: "completed",
      assets: [],
      team: [{ _id: "65c30b96e639681a13def0b5", name: "Jane Smith", role: "Manager" }],
    },
  ],
  users: [
    {
      _id: "65c5f27fb5204a81bde86833",
      name: "New User",
      title: "Designer",
      role: "Developer",
      isActive: true,
      createdAt: "2024-02-09T09:38:07.765Z",
    },
    {
      _id: "65c3176a0fd860f958baa099",
      name: "Emily Wilson",
      title: "Data Analyst",
      role: "Analyst",
      isActive: true,
      createdAt: "2024-02-07T05:38:50.816Z",
    },
  ],
  tasks: {
    todo: 6,
    "in progress": 3,
    completed: 1,
  },
};

export const chartData = [
  { name: "High", total: 2400 },
  { name: "Medium", total: 1398 },
  { name: "Low", total: 9800 },
];

export const tasks = [
  {
    _id: "65c5d547660756f6fd453a7a",
    title: "Duplicate – Review Code Changes",
    date: "2024-02-09T00:00:00.000Z",
    priority: "medium",
    stage: "in progress",
    assets: [],
    team: [{ _id: "65c317360fd860f958baa08e", name: "Alex Johnson", role: "Designer" }],
    description: "Review pull requests and check for logical errors.",
    subTasks: [
      {
        _id: "sub1",
        title: "Check for styling inconsistencies",
        date: "2024-09-21T00:00:00.000Z",
        tag: "review",
      },
    ],
    activities: [
      {
        type: "started",
        activity: "Started review",
        date: "2024-02-08T10:00:00.000Z",
        by: { _id: "65c317360fd860f958baa08e", name: "Alex Johnson" },
        _id: "act-1",
      },
      {
        type: "completed", // lowercase to match TASKTYPEICON keys
        activity: "Project completed!!",
        date: "2024-02-08T18:13:14.717Z",
        by: { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave Asante" },
        _id: "act-2",
      },
    ],
  },
  {
    _id: "65c5e12ab5204a81bd1111a1",
    title: "Implement Sidebar Navigation",
    date: "2024-02-12T00:00:00.000Z",
    priority: "low",
    stage: "completed",
    assets: [],
    team: [{ _id: "65c30b96e639681a13def0b5", name: "Jane Smith", role: "Manager" }],
    description:
      "Ensure all forms across the application have proper client-side and server-side validation.",
    activities: [
      {
        type: "commented",
        activity: "Left a note to refine hover states.",
        date: "2024-02-12T09:30:00.000Z",
        by: { _id: "65c30b96e639681a13def0b5", name: "Jane Smith" },
        _id: "act-3",
      },
    ],
  },
  {
    _id: "3",
    title: "Setup CI/CD Pipeline",
    date: "2024-09-23T00:00:00.000Z",
    priority: "high",
    stage: "todo",
    assets: [],
    team: [
      { _id: "65c317360fd860f958baa08e", name: "Alex Johnson", role: "Designer" },
      { _id: "65c3176a0fd860f958baa099", name: "Emily Wilson", role: "Analyst" },
    ],
    description:
      "Configure GitHub Actions to automatically test and deploy the application on merge to main.",
    subTasks: [
      {
        _id: "sub3",
        title: "Write build script",
        date: "2024-09-24T00:00:00.000Z",
        tag: "devops",
      },
    ],
    activities: [
      {
        type: "assigned",
        activity: "Assigned to Emily",
        date: "2024-09-23T10:00:00.000Z",
        by: { _id: "65c317360fd860f958baa08e", name: "Alex Johnson" },
        _id: "act-4",
      },
    ],
  },
  {
    _id: "65c5f12ab5204a81bde866a9",
    title: "Task Manager Youtube Video",
    date: "2024-02-09T00:00:00.000Z",
    priority: "high",
    stage: "todo",
    assets: [
      "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    team: [
      { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave Asante", role: "Admin" },
      { _id: "65c3176a0fd860f958baa099", name: "Emily Wilson", role: "Analyst" },
    ],
    description: "Prepare demo assets and record timeline interactions.",
    subTasks: [
      {
        _id: "sub3",
        title: "Write build script",
        date: "2024-09-24T00:00:00.000Z",
        tag: "devops",
      },
    ],
    activities: [
      {
        type: "started",
        activity: "Assets prepared",
        date: "2024-02-09T08:00:00.000Z",
        by: { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave Asante" },
        _id: "act-6",
      },
      {
        type: "commented",
        activity: "Assets prepared",
        date: "2024-02-09T08:00:00.000Z",
        by: { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave Asante" },
        _id: "act-5",
      },
      {
        type: "completed",
        activity: "Assets prepared",
        date: "2024-02-09T08:00:00.000Z",
        by: { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave Asante" },
        _id: "act-4",
      },
    ],
  },
];
