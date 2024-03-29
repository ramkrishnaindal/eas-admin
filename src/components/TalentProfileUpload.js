import { useState, useEffect } from "react";
import readXlsxFile from "read-excel-file";
import axios from "axios";
import { toast } from "react-toastify";
import { Table, Input, Container, Row, Col } from "reactstrap";
export default function TalentProfileUpload(props) {
  // const { isheader, isSrNo, answerColumnIndex, headerProps } = props;
  const [csvFile, setCsvFile] = useState();
  const [csvFileProductProperties, setCsvFileProductProperties] = useState();
  const [headers, setHeaders] = useState([]);
  const [headersProductProperties, setHeadersProductProperties] = useState([]);

  const [csvArray, setCsvArray] = useState([]);
  const [csvArrayProductProperties, setCsvArrayProductProperties] = useState(
    {}
  );

  const [stepsObject, setStepsObject] = useState({});
  // [{name: "", age: 0, rank: ""},{name: "", age: 0, rank: ""}]
  const main = async () => {
    const rows = await readXlsxFile(csvFile);
    setHeaders(rows[0]);
    processCSV(rows[0], rows.slice(1));
  };
  useEffect(() => {
    debugger;
    if (
      Object.keys(csvArrayProductProperties).length !== 0 &&
      Object.keys(stepsObject).length > 0
    ) {
      debugger;
      const prevStepsObject = { ...stepsObject };
      Object.keys(csvArrayProductProperties).forEach((key) => {
        prevStepsObject[key].Properties = csvArrayProductProperties[key];
      });
      setStepsObject(prevStepsObject);
    }
  }, [csvArrayProductProperties]);
  const mainProductProperties = async () => {
    debugger;
    const rows = await readXlsxFile(csvFileProductProperties);
    setHeadersProductProperties(rows[0]);
    processProductProperties(rows[0], rows.slice(1));
  };
  const processProductProperties = (hdrs, rows) => {
    const obj = {};
    rows.forEach((row) => {
      if (Object.keys(obj).includes(row[0])) {
        if (Object.keys(obj[row[0]]).includes(row[1])) {
          if (Object.keys(obj[row[0]][row[1]]).includes(row[2])) {
          } else {
            obj[row[0]][row[1]][row[2]] = row[3]
              .split(",")
              .map((i) => i.trim());
          }
        } else {
          obj[row[0]][row[1]] = {
            [row[2]]: row[3].split(","),
          };
        }
      } else {
        obj[row[0]] = {
          [row[1]]: {
            [row[2]]: row[3].split(","),
          },
        };
      }
    });
    debugger;
    console.log("obj", obj);
    setCsvArrayProductProperties(obj);
  };
  const processCSV = (hdrs, rows) => {
    // let uniqJobs = [...moduleUniqueJobs];
    console.log("hdrs", hdrs);
    const newArray = rows.map((row) => {
      let module;
      // debugger;
      const eachObject = hdrs.reduce((obj = {}, header, i) => {
        if (i <= 8) {
          let value = row[i];
          if (i === 2) {
            module = value;
            // x;
          }
          if (header?.trim() === "Job roles") {
            // let moduleObj = uniqJobs.find((item) => item.module === module);
            value = value || "";
            value = value.split(",");
            value = value.map((v) => v.replace("\t", "").trim());
            // const res = [];
            // value.forEach((item) => {
            //   if (!res.includes(item)) res.push(item);
            // });
            // value = res;
          }
          if (header === "Product") {
            value = value.split(",");
            value = value.map((v) => ({ name: v.trim(), imageUrl: "" }));
          }
          obj[header] = value;
        }
        return obj;
      }, {});
      return eachObject;
    });
    // debugger;
    setCsvArray(newArray);
    const objFinal = {};
    newArray.forEach((item) => {
      // if (item["Short_Name"]) {
      //   debugger;
      // }
      if (
        Object.keys(objFinal).length === 0 ||
        !objFinal.hasOwnProperty([item["Short_Name"]])
      ) {
        // debugger;
        objFinal[item["Short_Name"]] = {
          ["Primary Domain"]: item["Primary Domain"],
          Modules: {
            [item["Modules"]]: {
              Product: item["Product"],
              "Job roles": item["Job roles"],
            },
          },
          Services: item["Services"].split(",") || [],
          ["Role-Prefix and Product-Suffix"]:
            item["Role-Prefix and Product-Suffix"],
          Icon: item["Icon"]?.toLowerCase().trim() === "yes" ? true : false,
          Roles: item["Roles"]?.toLowerCase().trim() === "yes" ? true : false,
        };
      } else {
        objFinal[item["Short_Name"]]["Primary Domain"] = item["Primary Domain"];
        if (
          Object.keys(objFinal[item["Short_Name"]]).length === 0 ||
          !objFinal[item["Short_Name"]].hasOwnProperty("Modules")
        ) {
          debugger;
          objFinal[item["Short_Name"]]["Modules"] = {
            [item["Modules"]]: {
              Product: item["Product"],
              "Job roles": item["Job roles"],
            },
            Services: item["Services"] || [],
            ["Role-Prefix and Product-Suffix"]:
              item["Role-Prefix and Product-Suffix"],
            Icon: item["Icon"]?.toLowerCase().trim() === "yes" ? true : false,
            Roles: item["Roles"]?.toLowerCase().trim() === "yes" ? true : false,
          };
        } else {
          if (
            !objFinal[item["Short_Name"]]["Modules"].hasOwnProperty(
              item["Modules"]
            )
          ) {
            // debugger;
            objFinal[item["Short_Name"]]["Modules"][item["Modules"]] = {
              Product: item["Product"],
              "Job roles": item["Job roles"],
            };
          } else {
            const newProd = item["Product"].filter((pr) =>
              objFinal[item["Short_Name"]]["Modules"][
                item["Modules"]
              ].Product.some((p) => p.name === pr.name)
            );
            objFinal[item["Short_Name"]]["Modules"][
              item["Modules"]
            ].Product.push(newProd);
            // debugger;
            const newJobRoles = item["Job roles"]?.filter((jr) =>
              objFinal[item["Short_Name"]]["Modules"][item["Modules"]][
                "Job roles"
              ].includes(jr)
            );
          }
        }
      }
    });

    const keys = Object.keys(objFinal);
    keys.forEach((key) => {
      const modules = Object.keys(objFinal[key].Modules);
      let allModuleKey,
        products = [],
        jobs = [];
      modules.forEach((module, index) => {
        if (module.includes("(All Modules)")) {
          allModuleKey = module;
        } else {
          const currProducts = objFinal[key].Modules[module].Product;
          const currJobs = objFinal[key].Modules[module]["Job roles"];
          if (key === "PLM" && index === 23) return;
          currProducts.forEach((currProduct) => {
            const foundProduct = products.find((a) => currProduct.name);
            if (!foundProduct) {
              products.push(currProduct);
            }
          });
          currJobs.forEach((currJob) => {
            if (!jobs.includes(currJob)) {
              jobs.push(currJob);
            }
          });
        }
      });
      if (allModuleKey) {
        objFinal[key].Modules[allModuleKey].Product = products;
        objFinal[key].Modules[allModuleKey]["Job roles"] = jobs;
      }
    });
    console.log("objFinal", objFinal);
    // objFinal = {};
    // rows.forEach((row) => {
    //   hdrs.forEach((header, i) => {
    //     debugger;
    //     if (i <= 4) {
    //       if (i === 0) {
    //         if (!objFinal[row[0]]) objFinal[row[0]] = {};
    //       }
    //       if (i === 1) {
    //         if (
    //           Object.keys(objFinal[row[0]]).length === 0
    //           //  ||
    //           // (objFinal[row[0]].keys && !objFinal[row[0]][row[1]])
    //         ) {
    //           objFinal[row[0]][row[1]] = {};
    //         }
    //       }
    //       if (i === 2) {
    //         if (objFinal[row[0]][row[1]]) {
    //           if (
    //             Object.keys(objFinal[row[0]][row[1]]).length === 0 ||
    //             (objFinal[row[0]][row[1]].keys && !objFinal[row[0]][row[1]][row[2]])
    //           ) {
    //             objFinal[row[0]][row[1]][row[2]] = {};
    //           }
    //         }

    //       }
    //       if (header === "Product" && objFinal[row[0]][row[1]] && objFinal[row[0]][row[1]][row[2]]) {
    //         let value = row[i];
    //         value = value.split(",");
    //         value = value.map((v) => ({ name: v.trim(), imageUrl: '' }));
    //         debugger;
    //         if (objFinal[row[0]][row[1]][row[2]])
    //           objFinal[row[0]][row[1]][row[2]].Product = value;
    //       }
    //       if (header.trim() === "Job roles" && objFinal[row[0]][row[1]] && objFinal[row[0]][row[1]][row[2]]) {
    //         let value = row[i] || "";
    //         value = value.split(",");
    //         value = value.map((v) => v.trim());
    //         if (objFinal[row[0]][row[1]][row[2]]) objFinal[row[0]][row[1]][row[2]].Jobs = value;
    //       }
    //     }
    //   });
    // });
    setStepsObject(objFinal);
  };
  console.log("csvArray", csvArray);
  // console.log("moduleUniqueJobs", moduleUniqueJobs);
  console.log("stepsObject", stepsObject);
  // console.log("sendArray", sendArray);
  const submit = async () => {
    const formData = new FormData();
    const token = JSON.parse(localStorage.getItem("token"));
    let header2 = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    formData.append("talentProfileFile", csvFile);
    formData.append("steps", JSON.stringify(stepsObject));
    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/talentProfile/setTalentProfileSteps`,
        formData
        // ,
        // header2
      );
      console.log("file upload", resp.data.talentProfileUpload);
      toast.info(resp.data?.message);
    } catch (err) {
      toast.error("Error :" + JSON.stringify(err));
    }
  };
  const upload = () => {
    main();
  };
  const uploadProductProperties = () => {
    mainProductProperties();
  };
  return (
    <>
      <form id="csv-form" className="col-xs-9">
        <Container className="mt-5">
          <Row className="justify-content-start mb-3">
            <Col
              xs={4}
              style={{ textAlign: "left", marginLeft: 50 }}
              className="text-align-left ml-5 pl-5"
            >
              Upload talent details
            </Col>
          </Row>
          <Row className="justify-content-center mb-3">
            <Col sm={10}>
              <Input
                name="file"
                type="file"
                accept=".xlsx"
                id="csvFile"
                onClick={(e) => {
                  setCsvArray([]);
                }}
                onChange={(e) => {
                  setCsvFile(e.target.files[0]);
                }}
              />

              {/* <input
        type="file"
      ></input> */}
              {/* <br /> */}
            </Col>
            <Col sm={"auto"} className="p-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (csvFile) upload();
                }}
                style={{ padding: "5px" }}
              >
                Upload Excel
              </button>
            </Col>
          </Row>
          <Row className="justify-content-start mb-3">
            <Col
              xs={4}
              style={{ textAlign: "left", marginLeft: 50 }}
              className="text-align-left ml-5 pl-5"
            >
              Upload the properties for Products
            </Col>
          </Row>
          <Row className="justify-content-center mb-3">
            <Col sm={10}>
              <Input
                name="file"
                type="file"
                accept=".xlsx"
                onClick={(e) => {
                  setCsvArrayProductProperties([]);
                }}
                onChange={(e) => {
                  setCsvFileProductProperties(e.target.files[0]);
                }}
              />
              {/* <input
        type="file"
      ></input> */}
              {/* <br /> */}
            </Col>

            <Col sm={"auto"} className="p-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (csvFileProductProperties) uploadProductProperties();
                }}
                style={{ padding: "5px" }}
              >
                Upload Excel
              </button>
            </Col>
          </Row>
          {csvArray.length > 0 &&
            Object.keys(csvArrayProductProperties).length !== 0 && (
              <Row className="justify-content-center mb-3">
                <Col xs={1}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      submit();
                    }}
                    style={{ padding: "5px" }}
                  >
                    Submit
                  </button>
                </Col>
              </Row>
            )}
        </Container>
      </form>
      <br />
      <br />
      {csvArray.length > 0 ? (
        <>
          <Table bordered striped hover>
            <thead>
              <tr className="question-header">
                {headers.map((h, index) => {
                  return <th key={`${h}-${index}`}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {csvArray.map((item, i) => {
                return (
                  <tr key={`${item}-${i}`}>
                    {headers.map((h, index) => {
                      // if (index === 0)
                      //   return (
                      //     <td className="question-first-col" key={index}>
                      //       {item[headers[index]]}
                      //     </td>
                      //   );
                      return index <= 8 ? (
                        h === "Product" ? (
                          <td key={`${item}-${i}-${index}`}>
                            {item[headers[index]].map((it, ind) => (
                              <span key={`${item}-${i}-${index}-${it}-${ind}`}>
                                {it.name}
                              </span>
                            ))}
                          </td>
                        ) : (
                          <td>{item[headers[index]]}</td>
                        )
                      ) : null;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : null}
    </>
  );
}
