// POST
const data = {
    task: "post something",
    status: "done",
  };
  
  const postData = JSON.stringify(data);
  fetch("https://todolist-245e.restdb.io/rest/todo", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8c72e80e26877dd0577b4d",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(data => console.log(data));

// GET