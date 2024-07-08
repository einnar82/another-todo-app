import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import api from "./../api/index";
import { debounce } from "../utils";

const TodoContext = createContext();

export const useTodos = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uniqueLabels, setUniqueLabels] = useState([]);
  const [labels, setLabels] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [editId, setEditId] = useState(null);
  const [filterLabel, setFilterLabel] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const colors = useMemo(() => [
    "bg-yellow-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-pink-100",
    "bg-purple-100",
    "bg-red-100",
  ]);

  const fetchTodos = useCallback(async (filterLabel, page = 1) => {
    const defaultParams = {
      page,
    };
    try {
      const params =
        filterLabel !== ""
          ? {
              params: {
                ...defaultParams,
                label: filterLabel,
              },
            }
          : {
              params: defaultParams,
            };
      const response = await api.get("/tasks", params);
      setTodos(response.data.data);
      setCurrentPage(response.data.meta.current_page);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }, []);

  const fetchUniqueLabels = useCallback(async () => {
    try {
      const response = await api.get("/labels");
      setUniqueLabels(response.data);
    } catch (error) {
      console.error("Error fetching unique labels:", error);
    }
  }, []);

  const debouncedFetchTodos = useCallback(debounce(fetchTodos, 500), [
    fetchTodos,
  ]);

  useEffect(() => {
    debouncedFetchTodos(filterLabel, currentPage);
  }, [filterLabel, debouncedFetchTodos, currentPage]);

  useEffect(() => {
    fetchUniqueLabels();
  }, [fetchUniqueLabels]);

  const validateFields = useCallback(() => {
    const errors = {};
    if (!title.trim()) {
      errors.title = "Title is required";
    }
    if (!description.trim()) {
      errors.description = "Description is required";
    }

    if (labels.length === 0) {
      errors.labels = "Labels are required";
    }
    return errors;
  }, [title, description, labels]);

  const formatLabels = useCallback((labels) => {
    return labels
      .split(/[ ,]+/)
      .map((label) => label.trim())
      .filter((label) => label);
  }, []);

  const formatDate = useCallback((date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }, []);

  const handleAddTodo = useCallback(async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formattedLabels = formatLabels(labels);
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const currentDate = formatDate(new Date());

    try {
      const response = await api.post("/tasks", {
        title,
        description,
        labels: formattedLabels,
        date: currentDate,
        color: randomColor,
        completed: false,
      });

      fetchTodos(filterLabel, currentPage);
      fetchUniqueLabels(); // Refresh unique labels
      setTitle("");
      setDescription("");
      setLabels("");
      setShowModal(false);
      setErrors({});
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }, [
    title,
    description,
    labels,
    colors,
    formatLabels,
    formatDate,
    filterLabel,
    currentPage,
    fetchTodos,
    fetchUniqueLabels,
    validateFields,
  ]);

  const handleDeleteTodo = useCallback(
    async (id) => {
      try {
        await api.delete(`/tasks/${id}`);
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);

        if (updatedTodos.length === 0) {
          setFilterLabel(""); // Reset filter label to 'All' if no tasks remain
        }

        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        fetchUniqueLabels(); // Refresh unique label
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    },
    [todos, currentPage, fetchUniqueLabels]
  );

  const handleEditTodo = useCallback(
    async (id) => {
      try {
        const response = await api.get(`/tasks/${id}`);
        const todo = response.data.data;
        setTitle(todo.title);
        setDescription(todo.description);
        setLabels(todo.labels.join(" "));
        setColor(todo.color);
        setEditId(id);
        setShowModal(true);
      } catch (error) {
        console.error("Error getting todo:", error);
      }
    },
    [todos]
  );

  const handleUpdateTodo = useCallback(async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedLabels = formatLabels(labels);

    try {
      const response = await api.put(`/tasks/${editId}`, {
        title,
        description,
        labels: formattedLabels,
        color,
      });

      fetchTodos(filterLabel, currentPage);
      fetchUniqueLabels(); // Refresh unique labels
      setTitle("");
      setDescription("");
      setLabels("");
      setEditId(null);
      setShowModal(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }, [
    title,
    description,
    labels,
    color,
    editId,
    formatLabels,
    filterLabel,
    currentPage,
    fetchTodos,
    fetchUniqueLabels,
    validateFields,
  ]);

  const toggleComplete = useCallback(async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const date = new Date();
    const completedAt =
      todo.completed_at === null
        ? date.toISOString().slice(0, 19).replace("T", " ")
        : null;
    try {
      const response = await api.put(`/tasks/${id}`, {
        ...todo,
        completed_at: completedAt,
      });

      fetchTodos(filterLabel, currentPage);
      fetchUniqueLabels(); // Refresh unique labels
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  }, [todos, filterLabel, currentPage, fetchTodos, fetchUniqueLabels]);

  const handleFilterLabelChange = useCallback((label) => {
    setFilterLabel(label);
    setCurrentPage(1); // Reset page to 1 when filter changes
  }, []);

  const value = useMemo(
    () => ({
      currentPage,
      totalPages,
      todos,
      title,
      description,
      labels,
      color,
      colors,
      editId,
      filterLabel,
      showModal,
      errors,
      uniqueLabels,
      setCurrentPage,
      setTitle,
      setDescription,
      setLabels,
      setColor,
      setEditId,
      setFilterLabel: handleFilterLabelChange,
      setShowModal,
      setErrors,
      handleAddTodo,
      handleDeleteTodo,
      handleEditTodo,
      handleUpdateTodo,
      toggleComplete,
      formatLabels,
      formatDate,
    }),
    [
      todos,
      title,
      description,
      labels,
      color,
      editId,
      filterLabel,
      showModal,
      errors,
      colors,
      uniqueLabels,
      currentPage,
      totalPages,
    ]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
