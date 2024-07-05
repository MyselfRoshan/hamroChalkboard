import React, { useState, useEffect } from "react";

interface DataType {
  message: string;
}

export  function Main() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3333");
        const data: DataType = JSON.parse(await response.json());
        setMessage(data.message);
        console.log(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="container">
        <p className="read-the-docs">{message===""?"nothing":message} is showing</p>
      </div>
    </>
  );
}
