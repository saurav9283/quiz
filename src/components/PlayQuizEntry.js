import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Game from "./Game";
import quizContext from "../context/quizs/quizContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const PlayQuizEntry = () => {
  const [message, setMessage] = useState("");
  const [seq, setSeq] = useState("");
  const quizsInitial = [];
  const [quizs, setQuizs] = useState(quizsInitial);
  const [bool, setBool] = useState(false);

  var [val, setVal] = useState(0); // Initialize val as 0

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
      alert("Login first");
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

    // Initialize val and keep track of the correct and wrong answers
    let totalVal = 0;
    const correctAnswers = [];
    const wrongAnswers = [];

    for (const quiz of json) {
      if (quiz.selectedAnswer === quiz.correctAnswer) {
        // Correct answer
        totalVal += 3;
        correctAnswers.push(quiz._id);
      } else {
        // Wrong answer
        totalVal -= 1;
        wrongAnswers.push(quiz._id);
      }
    }

    setSeq("1");
    setQuizs(json);
    setVal(totalVal);

    toast.success(`Total 10 question 3 marks each and wrong answer -1 ${totalVal} marks!`, {
      position: "top-right",
      autoClose: 6000,
    });

    const disableBtn = () => {
      document.getElementById("btn2").disabled = true;
    };
    disableBtn();
  };

  const myFunction = () => {
    setVal(sessionStorage.getItem("val"));
    setBool(true);
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
        <h4>To start your quiz, enter a key: {message}</h4>
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

      { bool ? <div className={seq === "1" ? "d-flex" : "d-none"}>
        {" "}
        Your Marks is : {val}{" "}
      </div> : (<div  className={seq === "1" ? "d-flex" : "d-none"}>
        {" "} Total Marks is : {val}
      </div>)
      }

      <ToastContainer />
    </div>
  );
};

export default PlayQuizEntry;
