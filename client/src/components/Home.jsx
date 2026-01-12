import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../Css/Home.css";
import ProductModal from "../components/ProductModal";
import axios from "axios";
import deleteIcon from "../assets/Trash.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const Home = () => {
  const [tab, setTab] = useState("published");
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products/all");
    setProducts(res.data.list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const togglePublish = async (id) => {
    await axios.put(`http://localhost:5000/api/products/publish/${id}`);
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this?")) return;
    await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
    toast.success("Deleted Successfully");
    loadProducts();
  };

  const filtered = tab === "published" ? products.filter((p) => p.published) : products.filter((p) => !p.published);

  return (
    <div className="d-flex home-wrapper">
      <Sidebar />

      <div className="flex-grow-1 p-3 content-area">
        <Topbar />

        {/* TABS */}
        <div className="d-flex gap-4 mt-3 border-bottom">
          <button
            className={`btn border-0 bg-transparent fw-semibold pb-2 ${tab === "published" ? "text-primary border-bottom border-primary" : "text-muted"}`}
            onClick={() => setTab("published")}
          >
            Published
          </button>

          <button
            className={`btn border-0 bg-transparent fw-semibold pb-2 ${tab === "unpublished" ? "text-primary border-bottom border-primary" : "text-muted"}`}
            onClick={() => setTab("unpublished")}
          >
            Unpublished
          </button>
        </div>

        {/* PRODUCT GRID */}
        {filtered.length > 0 ? (
          <div className="row g-3 mt-3">
            {filtered.map((p) => (
              <div key={p._id} className="col-md-4 col-sm-6">
                <div className="card shadow-sm border-0 rounded h-100">
                  {/* IMAGE */}
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

                  <div className="card-body small">
                    <h6 className="fw-semibold">{p.name}</h6>

                    <div className="mt-2">
                      <div className="d-flex justify-content-between small text-muted">
                        <span>Product Type</span>
                        <span className="fw-semibold text-dark">{p.type}</span>
                      </div>

                      <div className="d-flex justify-content-between small text-muted">
                        <span>Quantity Stock</span>
                        <span className="fw-semibold text-dark">{p.qty}</span>
                      </div>

                      <div className="d-flex justify-content-between small text-muted">
                        <span>MRP</span>
                        <span className="fw-semibold text-dark">₹ {p.mrp}</span>
                      </div>

                      <div className="d-flex justify-content-between small text-muted">
                        <span>Selling Price</span>
                        <span className="fw-semibold text-dark">₹ {p.price}</span>
                      </div>

                      <div className="d-flex justify-content-between small text-muted">
                        <span>Brand Name</span>
                        <span className="fw-semibold text-dark">{p.brand}</span>
                      </div>

                      <div className="d-flex justify-content-between small text-muted">
                        <span>Images</span>
                        <span className="fw-semibold text-dark">{p.images.length}</span>
                      </div>

                      <div className="d-flex justify-content-between small text-muted">
                        <span>Exchange</span>
                        <span className="fw-semibold text-dark">{p.returnable}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button className={`btn w-50 ${p.published ? "btn-warning text-dark" : "btn-success"}`} onClick={() => togglePublish(p._id)}>
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

                      <button
                        className="btn border rounded d-flex align-items-center justify-content-center p-0"
                        style={{ width: "45px", height: "45px" }}
                        onClick={() => deleteProduct(p._id)}
                      >
                        <img src={deleteIcon} alt="del" className="img-fluid" style={{ width: "22px", opacity: "0.8" }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-box d-flex flex-column justify-content-center align-items-center">
            <h5 className="fw-semibold">No {tab === "published" ? "Published" : "Unpublished"} Products</h5>
            <p className="text-muted">Create your first product to publish</p>
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

export default Home;
