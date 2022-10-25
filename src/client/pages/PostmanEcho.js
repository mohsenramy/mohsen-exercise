import axios from "axios";
import React, { useState } from "react";
import { ItemGroup } from "../Components/ItemGroup";

const PostmanEcho = () => {
  const [data, setData] = useState(null);
  const [resStatus, setResStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const sendRequestHandler = () => {
    setLoading(true);
    axios
      .get("/api/postman-echo")
      .then((res) => {
        console.log(res);
        setData(res.data);
        setResStatus(res.status);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <h1>Postman Echo</h1>
      <div>
        <div>https://postman-echo.com/get?foo1=bar1&foo2=bar2</div>
        <button onClick={sendRequestHandler}>Send Request</button>
      </div>
      <div>
        <h1>Response</h1>
        {!loading && data && (
          <div>
            <h3>status: {resStatus}</h3>
            <div>{JSON.stringify(data, null, 2)}</div>
            {data.args && <ItemGroup title={"Arguments"} items={data.args} />}
            {data.headers && (
              <ItemGroup title={"Headers"} items={data.headers} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PostmanEcho;
