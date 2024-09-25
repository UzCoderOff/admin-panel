import { FileUpload } from "primereact/fileupload";
import React, { useState } from "react";
import { Button, TextInput } from "react-desktop/macOs";

const Adding = ({ addingOpen, setAddingOpen, fetchCateg }) => {
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("accessToken");

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
      fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          fetchCateg();
        })
        .catch((er) => console.log(er));
    } catch (er) {
      throw er;
    } finally {
      setNameEn("");
      setNameRu("");
      setImage(null);
      setAddingOpen(false);
    }
  };

  return (
    addingOpen && (
      <div
        className="bg-[#00000041] backdrop-blur-sm w-full h-[100vh] fixed top-0 left-0 z-50 flex justify-center items-center"
        onClick={() => setAddingOpen(false)}
      >
        <div
          className="w-2/4 h-fit bg-white rounded-lg text-center p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-2xl mb-4">Adding New Row</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name (EN):</label>
              <TextInput
                type="text"
                placeholder="Name (EN):"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="costum border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Name (RU):</label>
              <TextInput
                type="text"
                placeholder="Name (RU):"
                value={nameRu}
                onChange={(e) => setNameRu(e.target.value)}
                className="costum border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div className="mb-4">
              <FileUpload mode="basic" onSelect={handleImageChange} />
            </div>
            <Button type="submit" color="blue">
              Submit
            </Button>
          </form>
        </div>
      </div>
    )
  );
};

export default Adding;
