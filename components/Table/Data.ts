// import React from "react";

const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "TASK", uid: "task", sortable: true},
    {name: "DESCRIPTION", uid: "desc", sortable: true},
    {name: "PRIORITY", uid: "priority", sortable: true},
    {name: "CREATED", uid: "createdAt", sortable: true},
    {name: "UPDATED", uid: "updatedAt", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "ACTIONS", uid: "actions"},
  ];
  
  const statusOptions = [
    {name: "Active", uid: "Active"},
    {name: "Inactive", uid: "Inactive"},
    {name: "Completed", uid: "Completed"},
  ];

  const priorityOptions = [
    {name: "High", uid: "High"},
    {name: "Medium", uid: "Medium"},
    {name: "Low", uid: "Low"},
  ];
  
  const tasks = [
    {
      id: 1,
        task: "Task 1 asdas  ad asdasdasdas dsadasd asd sadasdasd sad",
        desc: "Description 1",
        priority: "High",
        createdAt: "2020-01-01",
        updatedAt: "2020-01-01",
        status: "Active",
    },
    // make 10 more
    {
        id: 2,
        task: "Task 2",
        desc: "Description 2 adas das das abjhsdb cacas cdsvhgsad ajsdcuysdavfasd dsadsc",
        priority: "Medium",
        createdAt: "2020-01-01",
        updatedAt: "2020-01-01",
        status: "Completed",
    },
    {
        id: 3,
        task: "Task 3",
        desc: "Description 3",
        priority: "Low",
        createdAt: "2020-01-01",
        updatedAt: "2020-01-01",
        status: "Inactive",
    }
   
  ];
  
  export {columns, tasks, statusOptions, priorityOptions};
  