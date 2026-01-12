import React, { useState, useEffect } from "react";
import "../Css/ProductModal.css";
import axios from "axios";
import { toast } from "react-toastify";

const ProductModal = ({ close, product }) => {
  const isEdit = Boolean(product);

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    type: "",
    qty: "",
    mrp: "",
    price: "",
    brand: "",
    images: [],
    oldImages: [], 
    returnable: "Yes",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        type: product.type,
        qty: product.qty,
        mrp: product.mrp,
        price: product.price,
        brand: product.brand,
        images: [],
        oldImages: product.images, 
        returnable: product.returnable,
      });
    }
  }, [product]);

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Please enter product name";
    if (!form.type) newErrors.type = "Select product type";
    if (!form.qty) newErrors.qty = "Enter quantity";
    if (!form.mrp) newErrors.mrp = "Enter MRP";
    if (!form.price) newErrors.price = "Enter selling price";
    if (!form.brand.trim()) newErrors.brand = "Enter brand name";
    if (!isEdit && form.images.length === 0) newErrors.images = "Upload at least 1 image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("type", form.type);
      data.append("qty", Number(form.qty));
      data.append("mrp", Number(form.mrp));
      data.append("price", Number(form.price));
      data.append("brand", form.brand);
      data.append("returnable", form.returnable);

      data.append("oldImages", JSON.stringify(form.oldImages));

      form.images.forEach((file) => {
        data.append("images", file);
      });

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/products/update/${product._id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product Updated Successfully");
      } else {
        await axios.post(`http://localhost:5000/api/products/add`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product Created Successfully");
      }

      close();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setForm({
      ...form,
      images: [...form.images, ...e.target.files],
    });
  };

  const removeNewImg = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const removeOldImg = (index) => {
    setForm({ ...form, oldImages: form.oldImages.filter((_, i) => i !== index) });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>{isEdit ? "Edit Product" : "Add Product"}</h5>
          <button className="btn-close" onClick={close}></button>
        </div>

        <div className="modal-body-form">
          <label>Product Name</label>
          <input
            className={`form-control mb-1 ${errors.name ? "error-border" : ""}`}
            name="name"
            onChange={handleChange}
            value={form.name}
            placeholder="CakeZone Walnut Brownie"
          />
          {errors.name && <small className="error-text">{errors.name}</small>}

          <label>Product Type</label>
          <select name="type" onChange={handleChange} value={form.type} className={`form-control mb-1 ${errors.type ? "error-border" : ""}`}>
            <option value="">Select product type</option>
            <option>Food</option>
            <option>Clothing</option>
            <option>Electronics</option>
          </select>
          {errors.type && <small className="error-text">{errors.type}</small>}

          <label>Quantity Stock</label>
          <input
            className={`form-control mb-1 ${errors.qty ? "error-border" : ""}`}
            name="qty"
            onChange={handleChange}
            value={form.qty}
            placeholder="Total numbers of Stock available"
          />
          {errors.qty && <small className="error-text">{errors.qty}</small>}

          <label>MRP</label>
          <input className={`form-control mb-1 ${errors.mrp ? "error-border" : ""}`} name="mrp" onChange={handleChange} value={form.mrp} placeholder="MRP" />
          {errors.mrp && <small className="error-text">{errors.mrp}</small>}

          <label>Selling Price</label>
          <input
            className={`form-control mb-1 ${errors.price ? "error-border" : ""}`}
            name="price"
            onChange={handleChange}
            value={form.price}
            placeholder="Selling Price"
          />
          {errors.price && <small className="error-text">{errors.price}</small>}

          <label>Brand Name</label>
          <input
            className={`form-control mb-1 ${errors.brand ? "error-border" : ""}`}
            name="brand"
            onChange={handleChange}
            value={form.brand}
            placeholder="Nestle / Puma / Apple"
          />
          {errors.brand && <small className="error-text">{errors.brand}</small>}

          <div className="d-flex justify-content-between">
            <label>Upload Product Images</label>
            <label className="add-more-label" htmlFor="product-img">
              Add More Photos
            </label>
          </div>
          <input type="file" id="product-img" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageUpload} />

          <div className="upload-box mb-1 img-container">
            {form.oldImages.map((img, idx) => (
              <div key={idx} className="img-preview">
                <img src={`http://localhost:5000/uploads/${img}`} alt="" />
                <span className="remove-btn" onClick={() => removeOldImg(idx)}>
                  ×
                </span>
              </div>
            ))}

            {form.images.map((file, idx) => (
              <div key={idx} className="img-preview">
                <img src={URL.createObjectURL(file)} alt="" />
                <span className="remove-btn" onClick={() => removeNewImg(idx)}>
                  ×
                </span>
              </div>
            ))}
          </div>

          <label>Exchange Eligibility</label>
          <select className="form-control mb-3" name="returnable" onChange={handleChange} value={form.returnable}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <button className="btn btn-primary w-100 create-btn" onClick={handleSubmit}>
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
