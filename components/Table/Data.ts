
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
  
  
  
  export {columns, statusOptions, priorityOptions};
  