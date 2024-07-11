type DataType = {
  message: string
}
// If uisng Client Component must use "use client" to use hooks in client side
// "use client"
export default async function Main() {
  const response=await fetch("http://localhost:3333");
  const data: DataType=JSON.parse(await response.json());
  return (
    <>
    <header>
<p>
  {data.message===""?"no data from server":data.message}
</p>
    </header>
      {/* <div className="container">
        <p className="read-the-docs">{data.message === "" ? "nothing" : data.message}</p>
      </div> */}
    </>
  );
}
