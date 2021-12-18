import { useRef, useState, useCallback } from "react";
import readXlsxFile from "read-excel-file";
import ReactTags from "react-tag-autocomplete";
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
export default function CSVReader(props) {
  // const { isheader, isSrNo, answerColumnIndex, headerProps } = props;
  const [csvFile, setCsvFile] = useState();
  const [headers, setHeaders] = useState([]);
  const [csvArray, setCsvArray] = useState([]);
  // const [options, setOptions] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [tags, setTags] = useState();
  const [mainTags, setMainTags] = useState();
  const reactTags = useRef();
  // [{name: "", age: 0, rank: ""},{name: "", age: 0, rank: ""}]
  const main = async () => {
    const rows = await readXlsxFile(csvFile);
    // console.log("** Done **", rows);
    setHeaders(rows[0]);
    const opt = [];
    rows[0].forEach((el) => {
      el = el || "";
      if (el.toLowerCase().includes("option ")) {
        opt.push(el.toLowerCase().replace("option ", "").toLowerCase());
      }
    });
    // setOptions(opt);
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
    [tags, tagsList]
  );
  const onDeleteMain = useCallback(
    (tagIndex) => {
      let prevTags = mainTags ? [...mainTags] : [];
      prevTags = prevTags.filter((_, i) => i !== tagIndex);
      setMainTags(prevTags);
    },
    [mainTags]
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
    [mainTags, tagsList]
  );
  const processCSV = (hdrs, rows) => {
    const newArray = rows.map((row) => {
      const qnsOptions = [];
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
        if (header.toLowerCase().includes("option") && value) {
          qnsOptions.push(header.toLowerCase().replace("option ", ""));
        }
        obj[header] = value;

        // obj[header] = values[i].slice(0, values[i].indexOf("\r"));
        return obj;
      }, {});
      const answers = qnsOptions.map((qns) => {
        return {
          option: qns,
          answer: eachObject.Answers.some((a) => a === qns),
        };
      });
      eachObject.questionAnswers = answers;
      return eachObject;
    });
    setCsvArray(newArray);
    const tagsArr = {};
    newArray.forEach((item, index) => {
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
  // console.log("tagsList", tagsList);
  // console.log("tags", tags);
  const submit = async () => {
    const {
      "Cert related": certRelated,
      Domain,
      // "File name": fileName,
      // "Module (specific)": moduleSpecific,
      // "No of Questions?": noOfQuestions,
      // Nos,
      Product,
      "Product specific": productSpecific,
      "Question Mode": questionMode,
      "Question Type": questionType,
      "Skill Level": skillLevel,
      "Source code": sourceCode,
      "Source type": sourceType,
      comments,
    } = csvArray[0];
    const arrayToStore = csvArray.slice(1).map((question) => {
      const {
        "Cert related": certRelatedRow,
        Domain: DomainRow,
        "File name": fileNameRow,
        "Module (specific)": moduleSpecificRow,
        "No of Questions?": noOfQuestionsRow,
        Nos: NosRow,
        Product: ProductRow,
        "Product specific": productSpecificRow,
        "Question Mode": questionModeRow,
        "Question Type": questionTypeRow,
        "Skill Level": skillLevelRow,
        "Source code": sourceCodeRow,
        "Source type": sourceTypeRow,
        questionAnswers,
        commentsRow,
        ...rest
      } = question;
      const qnsToSave = { ...rest };
      qnsToSave.certRelated = certRelated;
      qnsToSave.domain = DomainRow;
      qnsToSave.product = ProductRow;
      qnsToSave.fileName = csvFile.name;
      qnsToSave.productSpecific = productSpecific;
      qnsToSave.questionMode = questionMode;
      qnsToSave.questionType = questionType;
      qnsToSave.skillLevel = skillLevel;
      qnsToSave.sourceCode = sourceCode;
      qnsToSave.sourceType = sourceType;
      qnsToSave.comments = comments;
      const optionsWithAnswers = [];
      questionAnswers.forEach((qnsAns) => {
        if (`Option ${qnsAns.option}` in qnsToSave) {
          optionsWithAnswers.push({
            option: qnsToSave[`Option ${qnsAns.option}`],
            answer: qnsAns.answer,
          });
        }
      });
      qnsToSave.optionsWithAnswers = optionsWithAnswers;
      return qnsToSave;
    });
    // console.log("arrayToStore", arrayToStore);
    // eachObject.tags = mainTags.map((t) => t.name);

    const formData = new FormData();
    formData.append("questionFile", csvFile);
    mainTags.forEach((t) => {
      formData.append("tags", t.name);
    });
    formData.append("certRelated", certRelated);
    formData.append("domain", Domain);
    formData.append("noOfQuestions", arrayToStore.length);
    formData.append("product", Product);
    formData.append("productSpecific", productSpecific);
    formData.append("questionMode", questionMode);

    formData.append("questionType", questionType);
    formData.append("skillLevel", skillLevel);
    formData.append("sourceCode", sourceCode);
    formData.append("sourceType", sourceType);
    formData.append("comments", comments);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/questions/upload`,
        formData
      );
      console.log("file upload", response.data.qnsUpload);
      if (response.data.status) {
        const data = arrayToStore.map((item) => {
          return {
            question: item.Question,
            optionsWithAnswers: item.optionsWithAnswers || [],
            single: item.single,
            fileName: item.fileName,
            tags: item.Tags || [],
            fileUploadId: response.data.qnsUpload._id,
          };
        });
        const resp = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/questions/setQuestions`,
          { questions: data }
        );
        console.log("questions", resp.data.questions);
      }
    } catch {}
  };
  const upload = () => {
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
  // console.log(headers);
  // console.log("csvArray", csvArray);
  // console.log(csvArray.length > 0);
  // console.log("options", options);
  const giveAnswers = (index, isSingle, questionAnswers) => {
    const onRadioChange = (e) => {
      debugger;
      const currCsvArr = [...csvArray];
      let currentIndexQnsAns = [...currCsvArr[index].questionAnswers];
      currentIndexQnsAns = currentIndexQnsAns.map((curr) => {
        if (curr.option === e.target.value) {
          curr.answer = true;
        } else {
          curr.answer = false;
        }
        return curr;
      });
      currCsvArr[index].questionAnswers = currentIndexQnsAns;
      setCsvArray(currCsvArr);
    };
    const onCheckedChange = (e) => {
      debugger;
      const currCsvArr = [...csvArray];
      let currentIndexQnsAns = [...currCsvArr[index].questionAnswers];
      currentIndexQnsAns = currentIndexQnsAns.map((ech) => {
        if (ech.option === e.target.value) ech.answer = !ech.answer;
        return ech;
      });
      currCsvArr[index].questionAnswers = currentIndexQnsAns;
      setCsvArray(currCsvArr);
    };
    let markup;
    if (isSingle) {
      markup = (
        <FormGroup check>
          <Container>
            <Row>
              {questionAnswers.map((ans) => {
                return (
                  <Col>
                    <Input
                      type="radio"
                      name={`radio${index}`}
                      checked={ans.answer}
                      value={ans.option}
                      onChange={onRadioChange}
                    />
                    <Label check>{ans.option}</Label>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </FormGroup>
      );
    } else {
      markup = (
        <Container>
          <Row>
            <Col>
              {questionAnswers.map((ans) => {
                return (
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      checked={ans.answer}
                      value={ans.option}
                      onChange={onCheckedChange}
                    />
                    <Label check>{ans.option}</Label>
                  </FormGroup>
                );
              })}
            </Col>
          </Row>
        </Container>
      );
    }
    return markup;
  };
  return (
    <>
      <form id="csv-form" className="col-xs-9">
        <Container className="mt-5">
          <Row className="justify-content-center mb-3">
            <Col sm={10}>
              <Input
                name="file"
                type="file"
                accept=".xlsx"
                id="csvFile"
                onClick={(e) => {
                  setCsvArray([]);
                  setMainTags([]);
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
          {tagsList && tagsList.length > 0 && (
            <Row className="justify-content-center mb-3">
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
          {csvArray.length > 0 && (
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
                      } else if (h === "Answers") {
                        return (
                          <td>
                            {giveAnswers(i, item.single, item.questionAnswers)}
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
