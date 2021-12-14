import { useRef, useState, useCallback } from "react";
import readXlsxFile from "read-excel-file";
import ReactTags from "react-tag-autocomplete";
import { Table, Input, Container, Row, Col } from "reactstrap";
export default function CSVReader(props) {
  // const { isheader, isSrNo, answerColumnIndex, headerProps } = props;
  const [csvFile, setCsvFile] = useState();
  const [headers, setHeaders] = useState([]);
  const [csvArray, setCsvArray] = useState([]);
  const [options, setOptions] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [tags, setTags] = useState();
  const [mainTags, setMainTags] = useState();
  const reactTags = useRef();
  // [{name: "", age: 0, rank: ""},{name: "", age: 0, rank: ""}]
  const main = async () => {
    const rows = await readXlsxFile(csvFile);
    console.log("** Done **", rows);
    setHeaders(rows[0]);
    const opt = [];
    rows[0].forEach((el) => {
      el = el || "";
      if (el.toLowerCase().includes("option ")) {
        opt.push(el.toLowerCase().replace("option ", "").toLowerCase());
      }
    });
    setOptions(opt);
    processCSV(rows[0], rows.slice(1));
  };
  const onDelete = useCallback(
    (i, tagIndex) => {
      const prevTags = tags ? { ...tags } : {};
      prevTags[i] = prevTags[i].filter((_, i) => i !== tagIndex);
      setTags(prevTags);
    },
    [tags]
  );

  const onAddition = useCallback(
    (i, newTag) => {
      const prevTags = tags ? { ...tags } : {};
      const prevTagsList = [...tagsList];
      if (
        !prevTagsList.some(
          (s) => s.name.toLowerCase() === newTag.name.toLowerCase()
        )
      ) {
        prevTagsList[prevTagsList.length] = newTag;
        setTagsList(prevTagsList);
      }
      if (
        prevTags[i].some(
          (s) => s.name.toLowerCase() === newTag.name.toLowerCase()
        )
      )
        return;
      prevTags[i] = [...prevTags[i], newTag];
      setTags(prevTags);
    },
    [tags]
  );
  const onDeleteMain = useCallback(
    (tagIndex) => {
      const prevTags = mainTags ? [...mainTags] : [];
      prevTags = prevTags.filter((_, i) => i !== tagIndex);
      setMainTags(prevTags);
    },
    [tags]
  );

  const onAdditionMain = useCallback(
    (newTag) => {
      let prevTags = mainTags ? [...mainTags] : [];
      const prevTagsList = [...tagsList];
      if (
        !prevTagsList.some(
          (s) => s.name.toLowerCase() === newTag.name.toLowerCase()
        )
      ) {
        prevTagsList[prevTagsList.length] = newTag;
        setTagsList(prevTagsList);
      }
      if (
        prevTags.some((s) => s.name.toLowerCase() === newTag.name.toLowerCase())
      )
        return;
      prevTags = [...prevTags, newTag];
      setMainTags(prevTags);
    },
    [mainTags]
  );
  const processCSV = (hdrs, rows) => {
    const newArray = rows.map((row) => {
      const eachObject = hdrs.reduce((obj = {}, header, i) => {
        let value = row[i];
        if (header === "Answers") {
          value = value.split(",");
          value = value.map((v) => v.trim());
          obj.single = value.length === 1;
        }
        if (header === "Tags" && value) {
          value = value.split(",");
          value = value.map((v) => v.trim());
        }
        obj[header] = value;

        // obj[header] = values[i].slice(0, values[i].indexOf("\r"));
        return obj;
      }, {});
      return eachObject;
    });
    setCsvArray(newArray);
    const tagsArr = {};
    newArray.map((item, index) => {
      if (item && item.Tags) {
        const tagsArray = item.Tags.map((it, i) => {
          return { id: i, name: it };
        });
        tagsArr[index] = tagsArray;
      } else {
        tagsArr[index] = [];
      }
    });
    const tagsSuggestionsArr = [];
    newArray.forEach((item, index) => {
      if (item.Tags && item.Tags.length > 0) {
        item.Tags.forEach((t) => {
          if (!tagsSuggestionsArr.some((it) => it.name === t)) {
            tagsSuggestionsArr.push({ id: tagsSuggestionsArr.length, name: t });
          }
        });
      }
    });
    setTagsList(tagsSuggestionsArr);
    setMainTags(tagsSuggestionsArr);
    setTags(tagsArr);
  };
  console.log("tagsList", tagsList);
  console.log("tags", tags);
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
    <>
      <form id="csv-form" className="col-xs-9">
        <Container className="mt-5">
          <Row>
            <Col sm={11}>
              <Input
                name="file"
                type="file"
                accept=".xlsx"
                id="csvFile"
                onClick={(e) => setCsvArray([])}
                onChange={(e) => {
                  setCsvFile(e.target.files[0]);
                }}
              />
              {/* <input
        type="file"
      ></input> */}
              {/* <br /> */}
            </Col>
            <Col sm={1}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (csvFile) submit();
                }}
                className="col-xs-2"
              >
                Submit
              </button>
            </Col>
          </Row>
          {tagsList && tagsList.length > 0 && (
            <Row>
              <ReactTags
                ref={reactTags}
                minQueryLength={1}
                tags={mainTags ? mainTags : []}
                allowNew
                suggestions={tagsList || []}
                onDelete={onDeleteMain}
                onAddition={onAdditionMain}
              />
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
                  return <th>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {csvArray.map((item, i) => {
                return (
                  <tr key={i}>
                    {headers.map((h, index) => {
                      if (index === 0)
                        return (
                          <td className="question-first-col">
                            {item[headers[index]]}
                          </td>
                        );
                      if (h === "Tags") {
                        return (
                          <td>
                            <ReactTags
                              ref={reactTags}
                              minQueryLength={1}
                              tags={tags ? tags[i] : []}
                              allowNew
                              suggestions={tagsList || []}
                              onDelete={onDelete.bind(null, i)}
                              onAddition={onAddition.bind(null, i)}
                            />
                          </td>
                        );
                      } else return <td>{item[headers[index]]}</td>;
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
