import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TaskList = (props) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const [tasks, setTasks] = useState(props.tasks || []);
  const [newOrderInputVisible, setNewOrderInputVisible] = useState(false);
  const [pendingInputVisible, setPendingInputVisible] = useState(false);
  const [doneInputVisible, setDoneInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState({
    "New Order": "",
    "In Progress": "",
    Completed: "",
  });

  const onDragStart = (evt) => {
    let element = evt.currentTarget;
    element.classList.add("dragged");
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (evt) => {
    evt.currentTarget.classList.remove("dragged");
  };

  const onDragEnter = (evt) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add("dragged-over");
    evt.dataTransfer.dropEffect = "move";
  };

  const onDragLeave = (evt) => {
    let currentTarget = evt.currentTarget;
    let newTarget = evt.relatedTarget;
    if (newTarget.parentNode === currentTarget || newTarget === currentTarget) return;
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.remove("dragged-over");
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };

  const onDrop = (evt, value, status) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    let data = evt.dataTransfer.getData("text/plain");
    let updated = tasks?.map((task) => {
      if (task.id.toString() === data.toString()) {
        return { ...task, status: status };
      }
      return task;
    });
    setTasks(updated);
  };

  const taskAddClicked = (status, setInputVisible) => {
    setInputVisible((prevVisibility) => !prevVisibility);
  };

  let pending = tasks?.filter((data) => data.status === "In Progress");
  let done = tasks?.filter((data) => data.status === "Completed");
  let newOrder = tasks?.filter((data) => data.status === "New Order");

  const onAddButtonClick = (status) => {
    const trimmedValue = inputValue[status]?.trim();

    if (trimmedValue !== "") {
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newTask = {
        id: tasks.length + 1,
        name: trimmedValue,
        status: status,
        time: formattedTime,
      };

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        return updatedTasks;
      });
      setInputValue((prevInputValue) => ({
        ...prevInputValue,
        [status]: "",
      }));
    } else {
      alert("Please enter a task name.");
    }
  };
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleInputChange = (status, value) => {
    setInputValue((prevInputValue) => ({ ...prevInputValue, [status]: value }));
  };
  return (
    <div style={{ margin: "0", backgroundColor: "black", height: "100vh", width: "100vw" }}>
      <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "grey", height: "10vh", margin: "0" }}>Task Management</h1>
      <div className="container" style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div className="order small-box" onDragLeave={(e) => onDragLeave(e)} onDragEnter={(e) => onDragEnter(e)} onDragEnd={(e) => onDragEnd(e)} onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, false, "New Order")}>
          <section className="drag_container">
            <div className="container">
              <div className="drag_column">
                <div className="drag_row">
                  <h2>Todo List</h2>
                  <div style={{ height: "60px" }}>
                    {newOrderInputVisible && (
                      <>
                        <input value={inputValue["New Order"]} onChange={(e) => handleInputChange("New Order", e.target.value)} style={{ width: "89%" }}></input>
                        <button onClick={() => onAddButtonClick("New Order")} data-testid="addButton" className="add-btn">
                          Add
                        </button>
                      </>
                    )}
                    <button className="plus-btn" onClick={(e) => taskAddClicked("New Order", setNewOrderInputVisible)}>
                      +
                    </button>
                  </div>
                  {newOrder?.map((task) => (
                    <div className="card" key={task.id} id={task.id} draggable onDragStart={(e) => onDragStart(e)} onDragEnd={(e) => onDragEnd(e)}>
                      <div className="card_right" style={{ backgroundColor: "#A7C7E7", marginTop: "5px", padding: "10px", borderRadius: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div className="name">{"Name: " + task.name}</div>
                            <div className="status">{"Status: " + task.status}</div>
                            <div className="days">{"Time: " + task.time}</div>
                          </div>
                          <div className="delete-btn"  onClick={() => deleteTask(task.id)}>
                            {" "}
                            <FontAwesomeIcon icon={faTrash} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="pending small-box" onDragLeave={(e) => onDragLeave(e)} onDragEnter={(e) => onDragEnter(e)} onDragEnd={(e) => onDragEnd(e)} onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, false, "In Progress")}>
          <section className="drag_container">
            <div className="container">
              <div className="drag_column">
                <div className="drag_row">
                  <h2>In Progress</h2>
                  <div style={{ height: "60px" }}>
                    {pendingInputVisible && (
                      <>
                        <input value={inputValue["In Progress"]} onChange={(e) => handleInputChange("In Progress", e.target.value)} style={{ width: "89%" }}></input>
                        <button onClick={() => onAddButtonClick("In Progress")} data-testid="addButton" className="add-btn">
                          Add
                        </button>
                      </>
                    )}
                    <button className="plus-btn" onClick={(e) => taskAddClicked("In Progress", setPendingInputVisible)}>
                      +
                    </button>
                  </div>
                  {pending?.map((task) => (
                    <div className="card" key={task.id} id={task.id} draggable onDragStart={(e) => onDragStart(e)} onDragEnd={(e) => onDragEnd(e)}>
                      <div className="card_right" style={{ backgroundColor: "#FFFACD ", marginTop: "5px", padding: "10px", borderRadius: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div className="name">{"Name: " + task.name}</div>
                            <div className="status">{"Status: " + task.status}</div>
                            <div className="days">{"Time: " + task.time}</div>
                          </div>
                          <div className="delete-btn"  onClick={() => deleteTask(task.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="done small-box" onDragLeave={(e) => onDragLeave(e)} onDragEnter={(e) => onDragEnter(e)} onDragEnd={(e) => onDragEnd(e)} onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, true, "Completed")}>
          <section className="drag_container">
            <div className="container">
              <div className="drag_column">
                <div className="drag_row">
                  <h2>Completed</h2>
                  <div style={{ height: "60px" }}>
                    {doneInputVisible && (
                      <>
                        <input value={inputValue["Completed"]} onChange={(e) => handleInputChange("Completed", e.target.value)} style={{ width: "89%" }}></input>
                        <button onClick={() => onAddButtonClick("Completed")} data-testid="addButton" className="add-btn">
                          Add
                        </button>
                      </>
                    )}
                    <button className="plus-btn" onClick={() => taskAddClicked("Completed", setDoneInputVisible)}>
                      +
                    </button>
                  </div>
                  {done?.map((task) => (
                    <div className="card" key={task.id} id={task.id} draggable onDragStart={(e) => onDragStart(e)} onDragEnd={(e) => onDragEnd(e)}>
                      <div className="card_right" style={{ backgroundColor: "grey", marginTop: "5px", padding: "10px", borderRadius: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div className="name">{"Name: " + task.name}</div>
                            <div className="status">{"Status: " + task.status}</div>
                            <div className="days">{"Time: " + task.time}</div>
                          </div>
                          <div  className="delete-btn"  onClick={() => deleteTask(task.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div style={{ marginLeft: "30px" }}>
        <button style={{ width: "100px", padding: "5px", borderRadius: "5px" }} onClick={exportToExcel}>
          Export
        </button>
      </div>
    </div>
  );
};

export default TaskList;
