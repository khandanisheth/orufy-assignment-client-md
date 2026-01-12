import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../Css/Products.css";
import ProductModal from "../components/ProductModal";
import axios from "axios";
import iconmain from "../assets/iconoir_grid-add.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { toast } from "react-toastify";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/all");
      setProducts(res.data.list);
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
    loadProducts();
    toast.success("Deleted Successfully");
  };

  const togglePublish = async (id) => {
    await axios.put(`http://localhost:5000/api/products/publish/${id}`);
    loadProducts();
    toast.success("Published");
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="d-flex home-wrapper">
      <Sidebar />
      <div className="flex-grow-1 p-3 content-area">
        <Topbar title="Products" />

        {/* SEARCH + ADD BUTTON */}
        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
          <input className="form-control w-50" placeholder="Search products..." onChange={(e) => setSearch(e.target.value)} />
          <p
            className="add-link"
            onClick={() => {
              setEditProduct(null);
              setShowModal(true);
            }}
          >
            + Add Products
          </p>
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div className="d-flex flex-column align-items-center mt-5">
            <span className="square">
              <img src={iconmain} />
            </span>
            <h5 className="mt-3">Feels a little empty over here...</h5>
            <p className="text-muted" style={{ textAlign: "center" }}>
              You can create products without connecting store.
              <br />
              You can add products anytime.
            </p>

            <button
              className="btn btn-primary mt-2"
              onClick={() => {
                setEditProduct(null);
                setShowModal(true);
              }}
            >
              Add your Products
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map((p) => (
              <div key={p._id} className="col-md-4">
                <div className="prod-card shadow-sm h-100">
                  <div className="w-100 d-flex align-items-center justify-content-center">
                    <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={10} style={{ width: "100%", height: "200px" }}>
                      {p.images.map((img, i) => (
                        <SwiperSlide key={i} className="d-flex align-items-center justify-content-center">
                          <img
                            src={`http://localhost:5000/uploads/${img}`}
                            alt={p.name}
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <h6 className="prod-title">{p.name}</h6>

                  <div className="prod-info">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Product type</span>
                      <span className="fw-semibold small">{p.type}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Quantity Stock</span>
                      <span className="fw-semibold small">{p.qty}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">MRP</span>
                      <span className="fw-semibold small">₹{p.mrp}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Selling Price</span>
                      <span className="fw-semibold small">₹{p.price}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Brand Name</span>
                      <span className="fw-semibold small">{p.brand}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Images</span>
                      <span className="fw-semibold small">{p.images.length}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Exchange Eligible</span>
                      <span className="fw-semibold small">{p.returnable}</span>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-2">
                    <button className={`btn w-50 ${p.published ? "btn-warning" : "btn-primary"}`} onClick={() => togglePublish(p._id)}>
                      {p.published ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      className="btn btn-outline-secondary w-50"
                      onClick={() => {
                        setEditProduct(p);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button className="btn btn-outline-danger" onClick={() => handleDelete(p._id)} style={{ width: "45px" }}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editProduct}
          close={() => {
            setShowModal(false);
            loadProducts();
          }}
        />
      )}
    </div>
  );
};

export default Products;
