import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SpeedDial } from "primereact/speeddial";
import { Image } from "primereact/image";
import { CirclePlus, LogOut, Pencil, Trash2 } from "lucide-react";
import { Button, ProgressCircle } from "react-desktop/macOs";
import Adding from "./Adding";

const Home = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("accessToken");
  const [addingOpen, setAddingOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState([]);

  useEffect(() => {
    document.title = "Home • Admin Panel";
  }, []);

  const fetchCateg = () => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories", {
      method: "GET",
    })
      .then((e) => e.json())
      .then((data) => setProducts(data.data))
      .catch((e) => {
        throw e;
      });
  };

  useEffect(() => {
    fetchCateg();
  }, []);

  const imageTemplate = (rD) => {
    return (
      <Image
        src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${rD.image_src}`}
        className="w-[250px]  "
        alt={rD.name_en}
        preview
      />
    );
  };

  const deleteProduct = (id) => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
      method: "Delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((e) => {
      fetchCateg();
    });
  };

  const actions = (rD) => {
    return (
      <div className="flex flex-row align-middle justify-between items-center">
        <Button color="blue" onClick={() => console.log(rD.id)}>
          <Pencil color="#ffffff" />
        </Button>
        <Button
          color="blue"
          onClick={() => {
            setLoadingButton(...loadingButton, rD.id);
            deleteProduct(rD.id);
          }}
          disabled={loadingButton.includes(rD.id)}
          className={`${loadingButton.includes(rD.id) ? "py-2" : ""}`}
        >
          {loadingButton.includes(rD.id) ? (
            <ProgressCircle />
          ) : (
            <Trash2 color="#ffffff" />
          )}
        </Button>
        <div></div>
      </div>
    );
  };

  const items = [
    {
      label: "Log Out",
      icon: <LogOut color="#ffffff" />,
      command: () => {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      },
    },
    {
      label: "Add",
      icon: <CirclePlus color="#ffffff" />,
      command: () => {
        setAddingOpen(!addingOpen);
      },
    },
  ];

  return (
    <div>
      <Adding addingOpen={addingOpen} setAddingOpen={setAddingOpen} fetchCateg={fetchCateg} />
      <DataTable value={products} tableStyle={{ minWidth: "50rem" }}>
        {/* <Column field="id" header="ID"></Column> */}
        <Column field="name_en" header="Name (EN)"></Column>
        <Column field="name_ru" header="Name (RU)"></Column>
        <Column field="image_src" header="Image" body={imageTemplate}></Column>
        <Column header="Actions" body={actions}></Column>
      </DataTable>
      <SpeedDial
        model={items}
        radius={80}
        type="quarter-circle"
        direction="up-left"
        className="fixed bottom-4 right-4 bg-[#6a9dd8dc] rounded-full"
      />
    </div>
  );
};

export default Home;
