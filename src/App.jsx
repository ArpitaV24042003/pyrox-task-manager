import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost/task-api/read.php");
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (!title.trim()) return;

    const url = editId
      ? "http://localhost/task-api/update.php"
      : "http://localhost/task-api/create.php";

    const body = editId ? { id: editId, title } : { title };

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setTitle("");
    setEditId(null);
    window.location.reload();
  };

  const deleteTask = async (id) => {
    await fetch("http://localhost/task-api/delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    window.location.reload();
  };

  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task.id);
  };

  const saveNotification = async () => {
    if (!phone || !message || !time) return;

    await fetch("http://localhost/task-api/notification_create.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: phone,
        message_content: message,
        scheduled_time: time,
      }),
    });

    setPhone("");
    setMessage("");
    setTime("");

    alert("Notification saved!");
  };

  return (
    <div className="card">
      <h2>Task Manager</h2>

      <div className="task-input">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
        />
        <button onClick={addOrUpdateTask}>{editId ? "Update" : "Add"}</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span>
            <div>
              <button onClick={() => editTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Daily Notification</h3>

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button className="notify-btn" onClick={saveNotification}>
        Save Notification
      </button>
    </div>
  );
}

export default App;
