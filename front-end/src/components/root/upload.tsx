import axios from "axios";
import React from "react";

const ImageUpload = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const obj = Object.fromEntries(formData.entries());
    console.log("Form Data:", obj);
    axios
      .post("/api/attendance/upload", obj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" name="image" />
        <button type="submit">upload</button>
      </form>
    </div>
  );
};

export default ImageUpload;
