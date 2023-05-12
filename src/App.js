import { useState, useEffect } from "react";
function App() {
  const [message, setMessage] = useState(null);
  const [question, setQuestion] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const getMessages = async () => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: question,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  const createNewChat = () => {
    setMessage(null);
    setQuestion("");
    setCurrentTitle(null);
  };

  const handleClickChat = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setQuestion("");
  };

  useEffect(() => {
    if (!currentTitle && question && message) {
      setCurrentTitle(question);
    }
    if (currentTitle && question && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: question,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(
    (prevChat) => prevChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((prevChat) => prevChat.title))
  );

  console.log(uniqueTitles);

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, idx) => (
            <li key={idx} onClick={() => handleClickChat(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Chico</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>ChicoGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, idx) => (
            <li key={idx}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">ChatGPT version 4.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
