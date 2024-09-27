import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState, useEffect } from "react";

const Edit = ({ id, editOpen, setEditOpen, products, fetchCateg , toast }) => {
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("accessToken");

  const itemForEditing = products.find((e) => e.id == id);

  useEffect(() => {
    if (itemForEditing) {
      setNameEn(itemForEditing.name_en);
      setNameRu(itemForEditing.name_ru);
    }
  }, [itemForEditing]);

  const handleImageChange = (e) => {
    const file = e.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    formData.append("images", image);

    try {
      fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          fetchCateg();
          if (data.success) {
            toast.current.show({
              severity: "success",
              summary: "Category edited",
              detail: data.message,
            });
          } else {
            toast.current.show({
              severity: "error",
              summary: "Category not edited",
              detail: data.message,
            });
          }
        })
        .catch((er) => console.log(er));
    } catch (er) {
      toast.current.show({
        severity: "error",
        summary: "Category not edited",
        detail: "Something went wrong",
      });
      throw er;
    } finally {
      setNameEn("");
      setNameRu("");
      setImage(null);
      setEditOpen(false);
    }
  };

  return (
    <div
      className="bg-[#00000041] backdrop-blur-sm w-full h-[100vh] fixed top-0 left-0 z-50 flex justify-center items-center"
      onClick={() => setEditOpen(false)}
    >
      <div
        className="w-2/4 h-fit bg-white rounded-lg text-center p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl mb-4">Edit {itemForEditing.name_en}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name (EN):</label>
            <InputText
              type="text"
              placeholder="Name (EN):"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="costum border border-gray-300 rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name (RU):</label>
            <InputText
              type="text"
              placeholder="Name (RU):"
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
              className="costum border border-gray-300 rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <FileUpload mode="basic" onSelect={handleImageChange} required />
          </div>
          <div className="flex align-items-center"></div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
