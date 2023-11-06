import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Game from "./Game";
import quizContext from "../context/quizs/quizContext";

const PlayQuizEntry = () => {
  const [message, setMessage] = useState("");
  const [seq, setSeq] = useState("");
  const quizsInitial = [];
  const [quizs, setQuizs] = useState(quizsInitial);

  var [val, setVal] = useState("");


  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const context = useContext(quizContext);
  const { getQuizs } = context;
  let navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getQuizs();
    } else {
      alert("login first");
      navigate("/login");
    }
  }, []);

  const fetchallquiz = async () => {
    const numberOfRandomRecords = 10;
    const response = await fetch(
      `http://localhost:8000/api/quiz/fetchallquiznoauthentication/${message}?count=${numberOfRandomRecords}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    console.log(json, "FETCH");
    setSeq("1");
    setQuizs(json);
    // localStorage.setItem("val", 0);
    const disableBtn = () => {
      document.getElementById("btn2").disabled = true;
    };
    disableBtn();
  };

  console.log(seq);

  const myFunction = () => {
    console.log(sessionStorage.getItem("val"));
    setVal(sessionStorage.getItem("val"));
    const disableBtn = () => {
      document.getElementById("btn").disabled = true;
    };
    disableBtn();
  };

  return (
    <div>
      <div>
        <input
        placeholder="Enter the pass key"
          type="text"
          id="message"
          name="message"
          onChange={handleChange}
          value={message}
        />

        <h4>To start your quiz pass a key: {message}</h4>
        <div>right div</div>

        <button className="btn btn-primary" id="btn2" onClick={fetchallquiz}>
          Play
        </button>
      </div>

      {quizs.map((quiz) => {
        return <Game quiz={quiz} key={quiz._id} />;
      })}

      <button
        className={seq === "1" ? "btn btn-primary mx-2" : "d-none mx-2"}
        id="btn"
        onClick={myFunction}
      >
        {" "}
        GENERATE SCORE{" "}
      </button>

      <div className={seq === "1" ? "d-flex" : "d-none"}>
        {" "}
        Your Score is : {val}{" "}
      </div>

    </div>
  );
};

export default PlayQuizEntry;
