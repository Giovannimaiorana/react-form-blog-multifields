import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import style from "../css/modules/TheForm.module.css";

export default function TheForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    tags: [],
    isVisible: false,
  });
  console.log(formData);

  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Fetch posts from the ExpressJS backend when the component mounts
    fetchPosts();
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/posts");
      console.log("Data from backend:", response.data);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => {
      if (type === "checkbox" && name === "tags") {
        if (checked) {
          return {
            ...prevData,
            tags: [...prevData.tags, value],
          };
        } else {
          return {
            ...prevData,
            tags: prevData.tags.filter((tag) => tag !== value),
          };
        }
      } else {
        return {
          ...prevData,
          [name]: type === "checkbox" ? checked : value,
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, image, category, tags, isVisible } = formData;

    if (title.trim() !== "" && description.trim() !== "") {
      try {
        const response = await axios({
          method: editingId !== null ? "put" : "post",
          url: "http://localhost:3000/posts", // Replace with your actual API endpoint
          headers: {
            "Content-Type": "application/json",
          },
          data:
            editingId !== null
              ? { id: editingId, ...formData }
              : { id: uuidv4(), ...formData },
        });

        if (response.status === 200 || response.status === 201) {
          fetchPosts(); // Refresh the posts after adding/editing
          setEditingId(null);
          setFormData({
            title: "",
            description: "",
            image: "",
            category: "",
            tags: [],
            isVisible: false,
          });
        } else {
          console.error("Failed to add/edit post:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding/editing post:", error);
      }
    }
  };

  const handleEdit = (id) => {
    const articleToEdit = articles.find((article) => article.id === id);
    if (articleToEdit) {
      setFormData({ ...articleToEdit });
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/posts/${id}`); // Replace with your actual API endpoint

      if (response.status === 200) {
        fetchPosts(); // Refresh the posts after deleting
      } else {
        console.error("Failed to delete post:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className={style.ContainerForm}>
      <form className={style.StyleForm} onSubmit={handleSubmit}>
        <label htmlFor="title">
          {editingId !== null
            ? "Modifica Titolo Post"
            : "Inserisci Titolo Post"}
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Inserisci Titolo Post"
        />

        <label htmlFor="description">
          {editingId !== null
            ? "Modifica Descrizione Post"
            : "Inserisci Descrizione Post"}
        </label>
        <input
          id="description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Inserisci Descrizione"
        />

        <label htmlFor="image">
          {" "}
          {editingId !== null ? "Modifica Immagine" : "Inserisci Immagine"}
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="URL dell'immagine"
        />

        <label htmlFor="category">Categoria</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option disabled value="">
            Seleziona una categoria
          </option>
          <option value="categoria1">Categoria 1</option>
          <option value="categoria2">Categoria 2</option>
          {/* Aggiungi altre opzioni secondo le tue esigenze */}
        </select>

        <label>Tags</label>
        <div>
          <input
            type="checkbox"
            id="tag1"
            name="tags"
            value="tag1"
            checked={formData.tags.includes("tag1")}
            onChange={handleChange}
          />
          <label htmlFor="tag1">Tag 1</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="tag2"
            name="tags"
            value="tag2"
            checked={formData.tags.includes("tag2")}
            onChange={handleChange}
          />
          <label htmlFor="tag2">Tag 2</label>
        </div>

        <label>
          <input
            type="checkbox"
            id="isVisible"
            name="isVisible"
            checked={formData.isVisible}
            onChange={handleChange}
          />
          Pubblica
        </label>

        <button className={style.buttonSub} type="submit">
          {editingId !== null ? "Modifica" : "Aggiungi"}
        </button>
      </form>
      <div className={style.postStyle}>
        <h1>Articoli dal backend</h1>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <h2>{article.title}</h2>
              <img src={article.image} alt={article.title} />
              <p>{article.content}</p>
              <p>
                Tags:{" "}
                {article.tags.map((tag) => (
                  <span key={tag.id}>{tag.titleT}, </span>
                ))}
              </p>
              Category: {article.category ? article.category.name : "N/A"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
