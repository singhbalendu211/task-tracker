import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [todoTasks, setTodoTasks] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []); // Fetch once on mount

  useEffect(() => {
    // Apply filter whenever searchQuery changes
    handleFilterClick('all');
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      const data = response.data;
      console.log('Fetched tasks:', data);
      setTasks(data);
      setFilteredTasks(data);
      const completedCount = data.filter((task) => task.status === "completed")
        .length;
      setCompletedTasks(completedCount);
      setTodoTasks(data.length - completedCount);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleFilterClick = (status) => {
    let filtered = tasks;
    
    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((task) => task.status === status);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTasks(filtered);
  };

  const addTask = async (title, description, status) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        title,
        description,
        status,
      });
      const newTask = response.data;
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      // Update counts
      if (status === "completed") setCompletedTasks((prev) => prev + 1);
      else setTodoTasks((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      console.log('Context: Deleting task with ID:', taskId);
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      console.log('Task deleted successfully');
      const updatedTasks = tasks.filter((task) => task._id !== taskId && task.id !== taskId);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      const completedCount = updatedTasks.filter(
        (task) => task.status === "completed"
      ).length;
      setCompletedTasks(completedCount);
      setTodoTasks(updatedTasks.length - completedCount);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const editTask = async (taskId, title, description, status) => {
    try {
      console.log('Context: Editing task with ID:', taskId);
      await axios.put(`${API_URL}/tasks/${taskId}`, {
        title,
        description,
        status,
      });
      console.log('Task edited successfully');
      // Update local state after edit - check both _id and id properties
      const updatedTasks = tasks.map((task) =>
        (task._id === taskId || task.id === taskId) ? { ...task, title, description, status } : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      const completedCount = updatedTasks.filter(
        (task) => task.status === "completed"
      ).length;
      setCompletedTasks(completedCount);
      setTodoTasks(updatedTasks.length - completedCount);
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    if (!taskId) return console.error("taskId is missing!");
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { status });

      const updatedTasks = tasks.map((task) =>
        (task._id === taskId || task.id === taskId) ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      const completedCount = updatedTasks.filter(
        (task) => task.status === "completed"
      ).length;
      setCompletedTasks(completedCount);
      setTodoTasks(updatedTasks.length - completedCount);
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const clearCompletedTasks = async () => {
    try {
      const completedTaskIds = tasks
        .filter((task) => task.status === "completed")
        .map((task) => task._id || task.id);

      // Delete each completed task
      await Promise.all(
        completedTaskIds.map((id) => axios.delete(`${API_URL}/tasks/${id}`))
      );

      // Update local state
      const updatedTasks = tasks.filter((task) => task.status !== "completed");
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setCompletedTasks(0);
      setTodoTasks(updatedTasks.length);
    } catch (err) {
      console.error("Error clearing completed tasks:", err);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        completedTasks,
        todoTasks,
        searchQuery,
        setSearchQuery,
        handleFilterClick,
        addTask,
        deleteTask,
        editTask,
        updateTaskStatus,
        clearCompletedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
