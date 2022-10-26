import { Button } from "@mui/material";
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
      <div className="input-container">
        <div>https://postman-echo.com/get?foo1=bar1&foo2=bar2</div>
        <Button variant="contained" onClick={sendRequestHandler}>
          Send Request
        </Button>
      </div>
      <div>
        <h2>Response</h2>
        {!loading && data && (
          <div>
            <h3 className="subtitle success">status: {resStatus}</h3>
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
