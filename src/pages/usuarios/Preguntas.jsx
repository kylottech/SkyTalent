import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import { today, otherQuestions } from '../../services/questionsServices'
import Top from "../../components/Utils/Top";
import NewQuestionModal from "../../components/user/NewQuestionModal";
import ResponseModal from "../../components/user/ResponseModal";
import QuestionCard from '../../components/Preguntas/QuestionCard';
import AnswerCard from '../../components/Preguntas/AnswerCard';
import QuestionMenu from '../../components/Preguntas/QuestionMenu';
import Error from '../../components/Utils/Error';
import InfoModal from "../../components/Utils/InfoModal";



const Preguntas = ({route}) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.usuarios.Preguntas
  const { userInfo } = route.params;
  const [questions, setQuestions] = useState([]);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  useEffect(() => {
          
    if(winKylets !== 0){
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }))
      setShowConfirmation(true)
    }
  },[winKylets])

  const handleGetToday = async () => {
    try {
      today(logout)
        .then((response) => {
          setShowNewQuestionModal(response)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleGetQuestions = async () => {
    try {
      otherQuestions({_id: userInfo._id}, logout)
        .then((response) => {
          setQuestions(response)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleResponder = () => {
    setShowNewQuestionModal(false)
    setShowResponseModal(true)
  }

  useEffect(() => {
    handleGetQuestions()
  }, []);

  useEffect(() => {
    handleGetToday()
  }, []);

  const handleViewResponse = () => {
    console.log('handleViewResponse called, showAnswer:', showAnswer);
    if(!questions[currentQuestion].blocked){
      setShowAnswer(!showAnswer);
      console.log('showAnswer changed to:', !showAnswer);
    }
    else {
      navigate.navigate('BlockQuestion', {userInfo: userInfo, _id: questions[currentQuestion]._id, func: handleGetQuestions})
    }
    
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setShowAnswer(false);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSelectQuestion = (index) => {
    if (index !== currentQuestion) {
      setShowAnswer(false);
      setCurrentQuestion(index);
    }
  };

  

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);


  return (
    <View style={styles.container}>
      <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={screenTexts.Top} />
      {questions.length !== 0 && questions[currentQuestion] && <View style={styles.content}>
      <QuestionMenu
        questions={questions}
        currentQuestion={currentQuestion}
        onSelectQuestion={handleSelectQuestion}
      />
      <View style={styles.cardContainer}>
        <QuestionCard 
          question={questions[currentQuestion]}
          onViewResponse={handleViewResponse}
          showAnswer={showAnswer}
          userInfo={userInfo}
        />
        <AnswerCard 
          response={questions[currentQuestion]?.responseObj || null}
          showAnswer={showAnswer}
          onClose={() => setShowAnswer(false)}
          onNext={handleNextQuestion}
          userInfo={userInfo}
        />
      </View>
    </View>}

    <NewQuestionModal isOpen={showNewQuestionModal} onClose={setShowNewQuestionModal} response={handleResponder}/>

    <ResponseModal isOpen={showResponseModal} onClose={() => setShowResponseModal(false)} setWinKylets={setWinKylets} func={() => handleGetQuestions()}/>

    {error &&

      <Error message={errorMessage} func={setError} />

    }

    <InfoModal 
      celebration={true}
      isOpen={showConfirmation} 
      onClose={() => {setShowConfirmation(false), setWinKylets(0)} } 
      Title={winKyletsText} 
      Subtitle={screenTexts.KyletsSubtitle} 
      Button={screenTexts.KyletsButton} 
    />
          
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  cardContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 400
  }

});

export default Preguntas;
