import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import style from "../css/modules/TheForm.module.css";

export default function TheForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() !== "" && description.trim() !== "") {
      if (editingId !== null) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === editingId
              ? { ...article, title, description }
              : article
          )
        );
        setEditingId(null);
      } else {
        setArticles([...articles, { id: uuidv4(), title, description }]);
      }
      setTitle("");
      setDescription("");
    }
  };

  const handleEdit = (id) => {
    const articleToEdit = articles.find((article) => article.id === id);
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setDescription(articleToEdit.description);
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
          value={title}
          onChange={handleTitleChange}
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
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Inserisci Descrizione"
        />
        <button className={style.buttonSub} type="submit">
          {editingId !== null ? "Modifica" : "Aggiungi"}
        </button>
      </form>
      <h1>Post</h1>

      <div className={style.postStyle}>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <h1>{article.title}</h1>
              <p>{article.description}</p>
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
