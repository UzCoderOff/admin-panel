import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SpeedDial } from "primereact/speeddial";
import { Image } from "primereact/image";
import { CirclePlus, LogOut, Pencil, Trash2 } from "lucide-react";
import Adding from "./Adding";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import Edit from "./Edit";

const Home = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("accessToken");
  const [addingOpen, setAddingOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState([]);
  const toast = useRef(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setedItId] = useState(null);

  useEffect(() => {
    document.title = "Dashboard • Admin Panel";
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
    })
      .then((e) => e.json())
      .then((e) => {
        fetchCateg();
        if (e.success) {
          toast.current.show({
            severity: "success",
            summary: "Item deleted successfully",
            detail: "Item deleted successfully",
          });
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error deleting item",
            detail: e.message || JSON.stringify(e),
          });
        }
      })
      .catch((e) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: e.message || JSON.stringify(e),
        });
      })
      .finally(() => {
        const newLoadingButton = loadingButton.filter((e) => e == id);
        setLoadingButton(newLoadingButton);
      });
  };

  const actions = (rD) => {
    return (
      <div className="flex flex-row align-middle justify-center gap-2 items-center">
        <Button
          className="bg-[#3e9bfc] py-2 px-4"
          onClick={() => {
            setedItId(rD.id);
            setEditOpen(true);
          }}
        >
          <Pencil color="#ffffff" />
        </Button>
        <Button
          className="bg-[#3e9bfc] py-2 px-4"
          onClick={() => {
            setLoadingButton(...loadingButton, rD.id);
            deleteProduct(rD.id);
          }}
          disabled={loadingButton.includes(rD.id)}
        >
          {loadingButton.includes(rD.id) ? (
            <ProgressSpinner className="w-6 h-6" strokeWidth="8" />
          ) : (
            <Trash2 color="#ffffff" />
          )}
        </Button>
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
      <Toast ref={toast} />
      {editOpen && (
        <Edit
          id={editId}
          editOpen={editOpen}
          setEditOpen={setEditOpen}
          products={products}
          fetchCateg={fetchCateg}
          toast={toast}
        />
      )}
      <Adding
        addingOpen={addingOpen}
        setAddingOpen={setAddingOpen}
        fetchCateg={fetchCateg}
      />
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
