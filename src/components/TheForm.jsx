import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import style from "../css/modules/TheForm.module.css";

export default function TheForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
    tags: [],
    published: false,
  });
  console.log(formData);

  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchTags();
    fetchCategory();
  }, []);

  //recupero post dal back
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/posts");
      console.log("Data from backend:", response.data);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  //recupero tag
  const fetchTags = async () => {
    try {
      const responseTag = await axios.get("http://localhost:3000/tags");
      console.log("TagsFromBack:", responseTag);
      setTags(responseTag.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };
  //recupero category
  const fetchCategory = async () => {
    try {
      const responseCategories = await axios.get(
        "http://localhost:3000/categories"
      );
      console.log("CategoryFromBack:", responseCategories);
      setCategories(responseCategories.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
            tags: prevData.tags.filter((tagId) => tagId !== value),
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
    const { title, content, image, category, tags, published } = formData;

    if (title.trim() !== "" && content.trim() !== "") {
      try {
        const tagIds = formData.tags.map((tagId) => parseInt(tagId, 10));
        const postData = {
          title,
          content,
          image,
          category,
          tags: tagIds,
          published,
        };

        const response = await axios({
          method: editingId !== null ? "put" : "post",
          url: "http://localhost:3000/posts",
          headers: {
            "Content-Type": "application/json",
          },
          data: editingId !== null ? { ...postData } : postData,
        });

        if (response.status === 200 || response.status === 201) {
          fetchPosts(); // Refresh the posts after adding/editing
          setEditingId(null);
          setFormData({
            title: "",
            content: "",
            image: "",
            category: "",
            tags: [],
            published: false,
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

        <label htmlFor="content">
          {editingId !== null
            ? "Modifica Descrizione Post"
            : "Inserisci Descrizione Post"}
        </label>
        <input
          id="content"
          type="text"
          name="content"
          value={formData.content}
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
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <label>Tags</label>
        {tags.map((tag) => (
          <div key={tag.id}>
            <input
              type="checkbox"
              id={tag.id}
              name="tags"
              value={tag.id.toString()}
              checked={formData.tags.includes(tag.id.toString())}
              onChange={handleChange}
            />
            <label htmlFor={tag.id}>{tag.titleT}</label>
          </div>
        ))}

        <label>
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
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
                Category: {article.category ? article.category.name : "N/A"}
              </p>
              <p>
                Tags:{" "}
                {article.tags.map((tag) => (
                  <span key={tag.id}>{tag.titleT}, </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
