"use client";
// src/VideoRecorder.js
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CacheInput from "./cacheInput";
import TextField from "@mui/material/TextField";

import "./index.css";
import getEpoch from "./epoch";

// JSON.stringify({
//   client_id: "api-client-levant",
//   client_secret: "59c24382-18ac-41e5-9141-ef2dbcd2e8de",
//   grant_type: "client_credentials",
//   scope: "roles",
// });

JSON.stringify({
  client_id: "api-client-demo",
  client_secret: "21ba7936-ea0c-45ce-996d-887712f79799",
  grant_type: "client_credentials",
  scope: "roles",
});

const Kyc = () => {
  const baseUrl = "https://api.levants.io";
  const baseUrl2 = "https://uat.kian.digital/api-proxy";
  const router = useRouter();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = async (e) => {
    try {
      const response = await fetch(`${baseUrl}/v1/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: "api-client-demo",
          client_secret: "21ba7936-ea0c-45ce-996d-887712f79799",
          grant_type: "client_credentials",
          scope: "roles",
        }),
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      console.log(json);
      setToken(json.access_token);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);
  // {0,10} = 4,{10,20} = 4,{20,30} = 2,{30,40} = 2 {40,50}= 3 {50,60} = 3 {60,70} = 2 {70,80} = 3 {80,90 } = 2 {90,100} = 1 , {100,110} = 4 {110,120} = 1 {120,120} = 1 {130,140} = 3 {140,150} = 1 {160,170} = 2 {170,180} = 2 {180, 190} = 1 {190,200} = 4
  // 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,51,53,59,61,67,71,73,79, 83,89 ,97,101,103,107,109,113 ,127, 131 ,137, 139 , 149 , 163,167 , 173 , 179 , 181, 191,193,197,199
  const [filterInputs, setFilterInput] = React.useState({
    nationalCode: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
  });

  const onChangeInput = (name) => (e) => {
    setFilterInput({ ...filterInputs, [name]: e.target.value });
  };

  const handleNext = async () => {
    const birthDate = getEpoch(
      filterInputs.birthYear,
      filterInputs.birthMonth,
      filterInputs.birthDay
    );
    try {
      const response = await fetch(
        `${baseUrl}/v2/kyc/init/HEAD_POSITIONING/${filterInputs.nationalCode}/${birthDate}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //4ee57e12-81d5-45d8-96ca-34765a7db964
      // 4ee57e12-81d5-45d8-96ca-34765a7db964
      // Check if the response is okay
      if (!response.ok) {
        const json = await response.json();
        throw new Error("Network response was not ok");
      }
      const json = await response.json();

      const kycWindow = window.open(
        "https://gateway-sdk.vercel.app/",
        "_blank"
      );
      setTimeout(() => {
        kycWindow.postMessage(
          { token, kycId: json.kycId },
          "https://gateway-sdk.vercel.app/"
        );
      }, 2000);
      console.log("sending message....");

      // Wait for the new window to load, then send the data via postMessage
      // kycWindow = () => {
      //   console.log("sending message....");
      //   kycWindow.postMessage(
      //     { token, kycId: json.kycId },
      //     "http://localhost:3000"
      //   );
      // };
      // router.push(
      //   `https://kyc-gateway.levants.io/${json.kycId}?callback=${window.location.host}`
      // );

      // router.push(
      //   `https://kyc-gateway.mt.levants.io/${json.kycId}?callback=${window.location.origin}`
      // );

      // kyc-gateway.levants.io

      // console.log(json);
      // setOrderId(json.kycId);
      // const actionsArray = json.action.split(",");
      // Step 2: Create a dictionary for mapping
      // const actionMappings = {
      //   c: "center",
      //   l: "left",
      //   u: "up",
      //   d: "down",
      //   r: "right",
      // };
      // Step 3: Map array to corresponding meanings
      // const mappedActions = actionsArray.map(
      //   (action) => actionMappings[action]
      // );
      // const mapActionWithTitle = mappedActions.map((e) => {
      //   if (e === "center") {
      //     return {
      //       title: "مرکز",
      //       action: e,
      //     };
      //   } else if (e === "left") {
      //     return {
      //       title: "چپ",
      //       action: e,
      //     };
      //   } else if (e === "right") {
      //     return {
      //       title: "راست",
      //       action: e,
      //     };
      //   } else if (e === "down") {
      //     return {
      //       title: "پایین",
      //       action: e,
      //     };
      //   } else if (e === "up") {
      //     return {
      //       title: "بالا",
      //       action: e,
      //     };
      //   }
      // });
      // setLoading(false);
      // setActions(mapActionWithTitle);
      console.log(mapActionWithTitle);
    } catch (error) {
      setLoading(false);
      // theButton.classList.remove("buttonLoading");
      // theButton.classList.remove("disabled");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="main">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            direction: "rtl",
          }}
        >
          <CacheInput>
            <TextField
              id="outlined-basic"
              onChange={onChangeInput("nationalCode")}
              value={filterInputs.nationalCode}
              label={"شماره ملي"}
              variant="outlined"
              type="number"
              dir="rtl"
            />
          </CacheInput>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "12px",
            }}
          >
            <CacheInput>
              <TextField
                id="outlined-basic"
                onChange={onChangeInput("birthDay")}
                value={filterInputs.birthDay}
                label={"روز تولد"}
                variant="outlined"
                required={true}
                type="number"
                // onChange={onChangeCode}
                dir="rtl"
              />
            </CacheInput>
            <CacheInput>
              <TextField
                id="outlined-basic"
                type="number"
                onChange={onChangeInput("birthMonth")}
                value={filterInputs.birthMonth}
                label={"ماه تولد"}
                required={true}
                variant="outlined"
                dir="rtl"
              />
            </CacheInput>
            <CacheInput>
              <TextField
                id="outlined-basic"
                onChange={onChangeInput("birthYear")}
                value={filterInputs.birthYear}
                type="number"
                label={"سال تولد"}
                InputProps={{ inputProps: { max: 4 } }}
                required={true}
                variant="outlined"
                dir="rtl"
              />
            </CacheInput>
          </div>

          <button
            class="button"
            onClick={handleNext}
            // disabled={
            //   loading ||
            //   (filterInputs.nationalCode === "" &&
            //     filterInputs.birthDay === "" &&
            //     filterInputs.birthMonth === "" &&
            //     filterInputs.birthYear === "")
            // }
          >
            <span className="button__text"> استعلام از ثبت احوال</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Kyc;
