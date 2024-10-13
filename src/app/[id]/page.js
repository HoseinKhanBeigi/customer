"use client";
// src/VideoRecorder.js
import React, { useState, useRef, useMemo, useEffect } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";

// import "./index.css";

const Kyc = () => {
  const baseUrl2 = "https://uat.kian.digital/api-proxy";
  const baseUrl = "https://api.levants.io";
  const router = useRouter();
  const params = useParams();
  const [dataVideo, setDateVideo] = useState();
  // const [envState, setEnvState] = useEffect("");

  // const pathname = usePathname();
  // const uat = pathname.split("/").pop();
  // console.log(uat);

  const getToken = async (env) => {
    let url = env === "uat" ? baseUrl2 : baseUrl;

    try {
      const response = await fetch(`${url}/v1/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env === "uat" ? "api-client-levant" : "api-client-demo",
          client_secret:
            env === "uat"
              ? "59c24382-18ac-41e5-9141-ef2dbcd2e8de"
              : "21ba7936-ea0c-45ce-996d-887712f79799",
          grant_type: "client_credentials",
          scope: "roles",
        }),
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      //   setToken(json.access_token);
      return json;
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  useEffect(() => {
    const env = localStorage.getItem("env");

    getToken(env).then((res) => {
      const id = localStorage.getItem("kycId");

      handleNext(res.access_token, id, env);
    });
  }, []);

  const handleNext = async (token, id, env) => {
    let url = env === "uat" ? baseUrl2 : baseUrl;
    try {
      const response = await fetch(`${url}/v2/kyc/inquiry/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response is okay
      if (!response.ok) {
        const json = await response.json();
        seteErrorDetail(json.detail);
        throw new Error("Network response was not ok");
      }

      const json = await response.json();

      setDateVideo(json);
    } catch (error) {
      // setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {dataVideo && (
        <div style={{ width: "500px", position: "absolute" }}>
          <div>veryfication response:</div>
          <div>
            alivenessVerified:{dataVideo?.alivenessVerified ? "true" : "false"}
          </div>
          <div>desc: {dataVideo?.desc}</div>
          <div>
            faceVerified:{dataVideo?.faceVerified === true ? "true" : "false"}
          </div>
          <div>processTime:{dataVideo?.processTime}</div>
        </div>
      )}
    </div>
  );
};

export default Kyc;
