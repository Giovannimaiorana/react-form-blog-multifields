import React, { useState } from "react";
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

  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, image, category, tags, isVisible } = formData;

    if (title.trim() !== "" && description.trim() !== "") {
      const updatedArticles =
        editingId !== null
          ? articles.map((article) =>
              article.id === editingId ? { ...article, ...formData } : article
            )
          : [...articles, { id: uuidv4(), ...formData }];

      setArticles(updatedArticles);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        category: "",
        tags: [],
        isVisible: false,
      });
    }
  };

  const handleEdit = (id) => {
    const articleToEdit = articles.find((article) => article.id === id);
    if (articleToEdit) {
      setFormData({ ...articleToEdit });
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    setArticles(articles.filter((article) => article.id !== id));
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

      <h1>Post</h1>
      <div className={style.postStyle}>
        <ul>
          {articles
            .filter((article) => article.isVisible)
            .map((article) => (
              <li key={article.id}>
                <h1>{article.title}</h1>
                <img className={style.imgStyle} src={article.image} alt="" />
                <p>{article.description}</p>
                <p>Categoria: {article.category}</p>
                <p>Tags: {article.tags.join(", ")}</p>
                <p>Pubblicato: {article.isVisible ? "Sì" : "No"}</p>
                <div>
                  <button
                    className={style.buttonEdit}
                    onClick={() => handleEdit(article.id)}
                  >
                    Modifica
                  </button>
                  <button
                    className={style.buttonDelete}
                    onClick={() => handleDelete(article.id)}
                  >
                    Elimina
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
