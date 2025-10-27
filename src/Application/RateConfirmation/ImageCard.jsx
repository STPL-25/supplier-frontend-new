import { useState, useEffect, useContext } from "react";
import Card from "react-bootstrap/Card";
// import { RateContext } from "../Context/context";
import {API} from "../../config/configData";
import axios from "axios";


import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
function ImageCard() {
  const [ imageData, setImageData ] = useState([]);
  const {user,companyName,names,mobileNo}=useContext(DashBoardContext)

  // KTM state
  const [acceptedSupDebitImg, setAcceptedSupDebitImg] = useState([]);
  const [rejectedSupDebitImg, setRejectedSupDebitImg] = useState([]);
  const [acceptedSupCreditImg, setAcceptedSupCreditImg] = useState([]);
  const [rejectedSupCreditImg, setRejectedSupCreditImg] = useState([]);

  // Supplier state
  const [acceptedKtmDebitImg, setAcceptedKtmDebitImg] = useState([]);
  const [rejectedKtmDebitImg, setRejectedKtmDebitImg] = useState([]);
  const [acceptedKtmCreditImg, setAcceptedKtmCreditImg] = useState([]);
  const [rejectedKtmCreditImg, setRejectedKtmCreditImg] = useState([]);
  const [updatedImageData, setUpdatedImageData] = useState([]);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [id, setId] = useState("");
  const [selectImageId, setSelectImageId] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  

  const fetchData = async () => {
    const response = await axios.get(`${API}/imageData/${Id}`);
    console.log(response.data);
    setImageData({ ...response.data });
  };
  console.log(imageData);
  useEffect(() => {
    if (
      imageData.supDebit != null &&
      imageData.supCredit != null &&
      imageData.KTMDebit != null &&
      imageData.KTMCredit != null
    ) {
      if (value === "KtmCredit") {
        setUpdatedImageData(imageData.supDebit);
      } else if (value === "KtmDebit") {
        setUpdatedImageData(imageData.supCredit);
      } else if (value === "SupCredit") {
        setUpdatedImageData(imageData.KTMDebit);
      } else if (value === "SupDebit") {
        setUpdatedImageData(imageData.KTMCredit);
      } else {
        setUpdatedImageData([]);
      }
    }
  }, [
    value,
    imageData.supDebit,
    imageData.supCredit,
    imageData.KTMDebit,
    imageData.KTMCredit,
  ]);

  console.log(updatedImageData);
  console.log(value);
  console.log(status);

  const handleImageAccept = (event, img, id, index) => {
    if (value === "KtmDebit") {
      setSelectImageId(id);
      setAcceptedSupCreditImg((prev) => [
        ...prev,
        ...imageData.supCredit.filter(
          (imge, ind) => index === ind && !rejectedKtmCreditImg.includes(imge)
        ),
      ]);

    } else if (value === "KtmCredit") {
      setSelectImageId(id);

      setAcceptedSupDebitImg((prev) => [
        ...prev,
        ...imageData.supDebit.filter(
          (imge, ind) => index === ind && !rejectedSupDebitImg.includes(imge)
        ),
      ]);
    } else if (value === "SupDebit") {
      setSelectImageId(id);

      setAcceptedKtmCreditImg((prev) => [
        ...prev,
        ...imageData.KTMCredit.filter(
          (imge, ind) => index === ind && !rejectedSupCreditImg.includes(imge)
        ),
      ]);
    } else if (value === "SupCredit") {
      setSelectImageId(id);

      setAcceptedKtmDebitImg((prev) => [
        ...prev,
        ...imageData.KTMDebit.filter(
          (imge, ind) => index === ind && !rejectedKtmCreditImg.includes(imge)
        ),
      ]);
    }
  };
  const handleImageReject = (event, img, id, index) => {
    if (value === "KtmDebit") {
      setRejectedSupCreditImg((prev) => [
        ...prev,
        ...imageData.supCredit.filter(
          (imge, ind) => index === ind && !acceptedSupCreditImg.includes(imge)
        ),
      ]);
    } else if (value === "KtmCredit") {
      setRejectedSupDebitImg((prev) => [
        ...prev,
        ...imageData.supDebit.filter(
          (imge, ind) => index === ind && !acceptedSupDebitImg.includes(imge)
        ),
      ]);
    } else if (value === "SupDebit") {
      setRejectedKtmCreditImg((prev) => [
        ...prev,
        ...imageData.KTMCredit.filter(
          (imge, ind) => index === ind && !acceptedKtmDebitImg.includes(imge)
        ),
      ]);
    } else if (value === "SupCredit") {
      setRejectedKtmDebitImg((prev) => [
        ...prev,
        ...imageData.KTMDebit.filter(
          (imge, ind) => index === ind && !acceptedSupCreditImg.includes(imge)
        ),
      ]);
    }
  };

  const handleImageConfirm = async () => {
    let ImageData;
    if (value === "KtmCredit") {
      ImageData = {
        id,
        acceptedSupDebitImg,
        rejectedSupDebitImg,
        value: "KtmCredit",
      };
    } else if (value === "KtmDebit") {
      ImageData = {
        id,
        acceptedSupCreditImg,
        rejectedSupCreditImg,
        value: "KtmDebit",
      };
    } else if (value === "SupDebit") {
      ImageData = {
        id,
        acceptedKtmCreditImg,
        rejectedKtmCreditImg,
        value: "SupDebit",
      };
    } else if (value === "SupCredit") {
      ImageData = {
        id,
        acceptedKtmDebitImg,
        rejectedKtmDebitImg,
        value: "SupCredit",
      };
    }
    console.log(ImageData);
    try {
      const response = await axios.post(`${API}/post-supdebit-img`, ImageData);
      console.log(response.data);
      if(response.status===200){
        setTimeout(()=>{
          window.location.reload()

        },1000)
      }
      setSuccessMsg(response.data);
    } catch (error) {
      setErrorMsg(error.response.data)
    }

  };
  // const getCardStyle = (status) => {
  //   switch (status) {
  //     case "accepted":
  //       return { backgroundColor: "green" };
  //     case "rejected":
  //       return { backgroundColor: "red" };
  //     default:
  //       return { backgroundColor: "#ecfeff" };
  //   }
  // };
  console.log(rejectedSupDebitImg)
  console.log('Accepted Sup Credit Images:', acceptedSupCreditImg);
    console.log('Accepted Sup Debit Images:', acceptedSupDebitImg);
    console.log('Accepted Ktm Credit Images:', acceptedKtmCreditImg);
    console.log('Accepted Ktm Debit Images:', acceptedKtmDebitImg);
   const handleImageCancel=()=>{
    window.location.reload()
   } 
   console.log(user,companyName,names,mobileNo)
  return (
    <>
      {status === "no" || status === "sno" ? (
        <>
           <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white d-flex flex-wrap justify-content-around mt-10"> UPLOADED IMAGES
           </h1>
          <div className="d-flex flex-wrap justify-content-around ">
            {imageData.length !== 0 &&
              updatedImageData.map((img, index) => (
                <div className="p-2" key={index}>
                  {console.log(img)}
                  <Card
                    className="text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-10"
                    style={{
                      width: "50rem",
                      height: "35rem",
                      // backgroundColor: "#ecfeff",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={img}
                      alt="Image description"
                      style={{
                        width: "100%",
                        height: "80%",
                        objectFit: "contain",
                      }}
                    />
                    {(value === "KtmCredit"
                      ? (imageData.supDebitRejectImg.includes(img) ? imageData.supDebitRejectImg : imageData.supDebitAcceptImg)
                      : value === "KtmDebit"
                        ? (imageData.supCreditRejectImg.includes(img) ? imageData.supCreditRejectImg : imageData.supCreditAcceptImg)
                        : value === "SupCredit"
                          ? (imageData.KTMDebitRejectImg.includes(img) ? imageData.KTMDebitRejectImg : imageData.KTMDebitAcceptImg)
                          : value === "SupDebit"
                            ? (imageData.KTMCreditRejectImg.includes(img) ? imageData.KTMCreditRejectImg : imageData.KTMCreditAcceptImg)
                            : []).includes(img) ? null : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "20%",
                        }}
                      >
                           {console.log((acceptedSupCreditImg.includes(img) ||
                          acceptedSupDebitImg.includes(img) ||
                          acceptedKtmCreditImg.includes(img) ||
                          acceptedKtmDebitImg.includes(img)))}
                         
                        {(acceptedSupCreditImg.includes(img) ||
                          acceptedSupDebitImg.includes(img) ||
                          acceptedKtmCreditImg.includes(img) ||
                          acceptedKtmDebitImg.includes(img)) ? (
                            <div className="text-green-500 font-bold text-xl flex items-center">
                              {/* <img src={accept} alt="Accept" /> */}
                          </div>
                          
                        ) : (rejectedSupCreditImg.includes(img) ||
                          rejectedSupDebitImg.includes(img) ||
                          rejectedKtmCreditImg.includes(img) ||
                          rejectedKtmDebitImg.includes(img)) ? (
                          <div className="text-red-500 font-bold text-xl">
                              {/* <img src={reject} alt="Reject" /> */}
                              </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "20%",
                            }}
                          >
                            <button
                              type="button"
                              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                              onClick={(event) => handleImageAccept(event,img,id, index)}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                              onClick={(event) => handleImageReject(event,img,id, index)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </Card>
                </div>
              ))}
          </div>
          {
            (
              value === "KtmCredit"
                ? (acceptedSupDebitImg.length || rejectedSupDebitImg.length)
                : value === "KtmDebit"
                  ? (acceptedSupCreditImg.length || rejectedSupCreditImg.length)
                  : value === "SupCredit"
                    ? (acceptedKtmDebitImg.length || rejectedKtmDebitImg.length)
                    : value === "SupDebit"
                      ? (acceptedKtmCreditImg.length || rejectedKtmCreditImg.length)
                      : 0
            ) > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                }}
              >
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-gray-500 to-gray-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={handleImageCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-blue-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={handleImageConfirm}
                >
                  Confirm
                </button>
              </div>
            ) : null
          }
          {successMsg ? (
            <div className="acceptance-message flex items-center justify-center">
              <div
                className="bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700"
                role="alert"
              >
                <span className="font-medium">{successMsg}</span>
              </div>
            </div>
          ) : null}{" "}
          <br />
          {errorMsg ? <div className="acceptance-message flex items-center justify-center">
            <div className="bg-red-100 rounded-lg p-2 mb-2 text-xs text-red-700" role="alert">
              <span className="font-medium">{errorMsg}</span>
            </div>
          </div> : null}
        </>
      ) : status === "acc" || status === "sacc" ? (
       <>
       <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white d-flex flex-wrap justify-content-around mt-10">  ACCEPTED IMAGES
       </h1>



        <div className="d-flex flex-wrap justify-content-around">
          {/* {console.log(imageData)} */}
          {imageData.length !== 0 &&
            (value === "KtmCredit"
              ? imageData.supDebitAcceptImg
              : value === "KtmDebit"
                ? imageData.supCreditAcceptImg
                : value === "SupCredit"
                  ? imageData.KTMDebitAcceptImg
                  : value === "SupDebit"
                    ? imageData.KTMCreditAcceptImg
                    : []
            ).map((img, index) => (
              <div className="p-2" key={index}>
                <Card
                  className="text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-10"
                  style={{
                    width: "50rem",
                    height: "35rem",
                    // backgroundColor: "#ecfeff",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={img}
                    alt="Image description"
                    style={{
                      width: "100%",
                      height: "80%",
                      objectFit: "contain",
                    }}
                  />
                </Card>
              </div>
            ))}
        </div>
        </>
      ) : null}
    </>
  );
}

export default ImageCard;
