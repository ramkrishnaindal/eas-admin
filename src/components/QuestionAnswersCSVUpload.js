import { useState } from "react";
import readXlsxFile from "read-excel-file";
import { Table } from "reactstrap";
export default function CSVReader(props) {
  // const { isheader, isSrNo, answerColumnIndex, headerProps } = props;
  const [csvFile, setCsvFile] = useState();
  const [headers, setHeaders] = useState([]);
  const [csvArray, setCsvArray] = useState([]);
  const [options, setOptions] = useState([]);
  // [{name: "", age: 0, rank: ""},{name: "", age: 0, rank: ""}]
  const main = async () => {
    const rows = await readXlsxFile(csvFile);
    console.log("** Done **", rows);
    setHeaders(rows[0]);
    const opt = [];
    rows[0].forEach((el) => {
      debugger;
      if (el.toLowerCase().includes("option ")) {
        opt.push(el.toLowerCase().replace("option ", "").toLowerCase());
      }
    });
    setOptions(opt);
    processCSV(rows[0], rows.slice(1));
  };

  const processCSV = (hdrs, rows) => {
    const newArray = rows.map((row) => {
      const eachObject = hdrs.reduce((obj = {}, header, i) => {
        let value = row[i];
        if (header === "Answers") {
          value = value.split(",");
          value = value.map((v) => v.trim());
          obj.single = value.length === 1;
        }

        obj[header] = value;

        // obj[header] = values[i].slice(0, values[i].indexOf("\r"));
        return obj;
      }, {});
      return eachObject;
    });
    setCsvArray(newArray);
  };
  const submit = () => {
    main();
    // const file = csvFile;
    // const reader = new FileReader();

    // reader.onload = function (e) {
    //   const text = e.target.result;
    //   console.log(text);
    //   processCSV(text, ";");
    // };

    // reader.readAsText(file);
  };
  console.log(headers);
  console.log("csvArray", csvArray);
  console.log(csvArray.length > 0);
  console.log("options", options);
  return (
    <form id="csv-form">
      <input
        type="file"
        accept=".xlsx"
        id="csvFile"
        onChange={(e) => {
          setCsvFile(e.target.files[0]);
        }}
      ></input>
      <br />
      <button
        onClick={(e) => {
          e.preventDefault();
          if (csvFile) submit();
        }}
      >
        Submit
      </button>
      <br />
      <br />
      {csvArray.length > 0 ? (
        <>
          <Table bordered striped hover>
            <thead>
              <tr>
                {headers.map((h, index) => {
                  return <th>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {csvArray.map((item, i) => {
                return (
                  <tr key={i}>
                    {headers.map((h, index) => {
                      return <td>{item[headers[index]]}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : null}
    </form>
  );
}
