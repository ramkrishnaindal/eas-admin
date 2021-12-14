import QuestionAnswersCSVUpload from "./components/QuestionAnswersCSVUpload";
import "./App.css";
console.log("REACT_APP_SERVER_URL", process.env.REACT_APP_SERVER_URL);
function App() {
  return (
    <div className="App">
      <QuestionAnswersCSVUpload />
    </div>
  );
}

export default App;
