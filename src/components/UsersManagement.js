import { useState } from "react";
import readXlsxFile from "read-excel-file";
import axios from "axios";
import {
  Table,
  Input,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
export default function TalentProfileUpload(props) {
  // const userTypeRef = useRef();
  // const { isheader, isSrNo, answerColumnIndex, headerProps } = props;
  const [results, setResults] = useState([]);
  const [userType, setUserType] = useState("");
  const [checkValues, setCheckValues] = useState([]);
  const disabled = !checkValues.find((i) => i === true);
  const headers = [" ", "User Name", "Email", "Active"];
  const getUsers = async (val) => {
    console.log("val", val);
    const token = JSON.parse(localStorage.getItem("token"));
    let header2 = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if (val === "") {
      setResults([]);
      return;
    }
    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/getAllUser`,
        {},
        header2
      );
      console.log("Users", resp.data.data);
      const resultData = resp.data.data.filter((item) => {
        if (item.userRole.name.toLowerCase().trim() === "admin") {
          const user = localStorage.getItem("user");
          if (user) {
            return (
              item._id !== JSON.parse(user)._id &&
              item.userRole.name.toLowerCase().trim() === val
            );
          }
          return item.userRole.name.toLowerCase().trim() === val;
        } else {
          return item.userRole.name.toLowerCase().trim() === val;
        }
      });
      setResults(resultData);
      setCheckValues([...Array(resultData.length)].map((x) => false));
    } catch {}
  };
  console.log("results", results);
  console.log("checkValues", checkValues);
  const deleteUsers = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected users?") ===
      true
    ) {
      const token = JSON.parse(localStorage.getItem("token"));
      let header2 = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      // formData.append("talentProfileFile", csvFile);
      // formData.append("steps", JSON.stringify(stepsObject));
      try {
        checkValues.forEach(async (checkedValue, index) => {
          if (checkedValue) {
            const resp = await axios.post(
              `${process.env.REACT_APP_SERVER_URL}/api/users/deleteUser`,
              { _id: results[index]._id },
              header2
            );
          }
          if (index === checkValues.length - 1) {
            alert("Users deleted successfully");
            debugger;
            getUsers(userType);
          }
        });

        // console.log("file upload", resp.data.talentProfileUpload);
      } catch {}
    }
  };
  const activateDeactivateUsers = async (active) => {
    const token = JSON.parse(localStorage.getItem("token"));
    let header2 = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    // formData.append("talentProfileFile", csvFile);
    // formData.append("steps", JSON.stringify(stepsObject));
    try {
      checkValues.forEach(async (checkedValue, index) => {
        if (checkedValue) {
          const resp = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/users/updateUserStatus`,
            { _id: results[index]._id, active: active ? 1 : 0 },
            header2
          );
        }
        if (index === checkValues.length - 1) {
          alert(`Users ${active ? "activated" : "deactivated"} successfully`);
          debugger;
          getUsers(userType);
        }
      });

      // console.log("file upload", resp.data.talentProfileUpload);
    } catch {}
  };

  return (
    <>
      <Container>
        <Row className="d-flex justify-content-center align-items-center">
          <Col xs={6}>
            <FormGroup className="d-flex align-items-center items-start">
              <Label
                for="userRole"
                className="px-2"
                style={{ textAlign: "left" }}
              >
                Role
              </Label>
              <Input
                // ref={userTypeRef}
                type={"select"}
                // size="2"
                name="userRole"
                // value={stateObj?.userRole}
                onChange={(e) => {
                  setUserType(e.target.value);
                  getUsers(e.target.value);
                }}
              >
                <option value={""}></option>
                <option value={"freelancer"}>Talent</option>
                <option value={"employer"}>Employer</option>
                <option value={"admin"}>Administrator</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>

        <br />
        <br />
        {/* {csvArray.length > 0 ? ( */}
        <>
          <Table bordered striped hover>
            <thead>
              <tr className="question-header">
                {headers.map((h, index) => {
                  if (index === 0) {
                    return (
                      <th key={`${h}-${index}`}>
                        <Input
                          type="checkbox"
                          onChange={(e) =>
                            setCheckValues((prev) => {
                              // prev.forEach((it) => {
                              //   debugger;
                              //   it = e.target.checked;
                              // });
                              // console.log("prev", prev);
                              return prev.map(() => e.target.checked);
                            })
                          }
                        />
                      </th>
                    );
                  } else {
                    return <th key={`${h}-${index}`}>{h}</th>;
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {results.map((item, i) => {
                return (
                  <tr key={`${item._id}`}>
                    <td>
                      <Input
                        type="checkbox"
                        checked={checkValues[i]}
                        onChange={(e) =>
                          setCheckValues((prev) => {
                            prev[i] = e.target.checked;
                            return [...prev];
                          })
                        }
                      />
                    </td>
                    <td>
                      <span>{`${item.firstName} ${item.lastName}`}</span>
                    </td>
                    <td>
                      <span>{`${item.email}`}</span>
                    </td>
                    <td>
                      <Input
                        type="checkbox"
                        readOnly
                        disabled
                        checked={item.active === 1}
                        onChange={(e) => console.log(e.target.checked)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Row className="d-flex justify-content-center align-items-center">
            <Col
              xs={8}
              className="d-flex justify-content-center align-items-center"
            >
              <button
                type="submit"
                disabled={disabled}
                className="btn btn-primary btn-sm mx-2"
                style={{ minWidth: "100px" }}
                onClick={activateDeactivateUsers.bind(null, true)}
              >
                Set Active
              </button>
              <button
                type="button"
                disabled={disabled}
                className="btn btn-secondary btn-sm mx-2"
                style={{ minWidth: "100px" }}
                onClick={activateDeactivateUsers.bind(null, false)}
              >
                Set Inactive
              </button>
              <button
                type="button"
                disabled={disabled}
                className="btn btn-danger btn-sm mx-2"
                style={{ minWidth: "100px" }}
                onClick={deleteUsers}
              >
                Delete
              </button>
            </Col>
          </Row>
        </>
        {/* ) : null} */}
      </Container>
    </>
  );
}
