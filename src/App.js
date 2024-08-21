import "./App.css";
import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price =name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        price,
        name:name.substring(price.length+1), 
        datetime, 
        description }),
    }).then((response) => {
      return response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      });
    });
  }

  return (
    <main>
      <h1>
        $400<span>.00</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            placeholder={"+200 nwe samsumg tv"}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input  type="text" 
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}  
                  placeholder={"descripttion"} />
        </div>
        <button type="submit">Add new transactions</button>

      </form>
      <div className="transactions">

        <div className="transaction">
          <div className="left">
            <div className="name">New Samsumg TV</div>
            <div className="description">It was time for new tv</div>
          </div>
          <div className="right">
            <div className="price red">-$200.00</div>
            <div className="datetime">20/09/2021 15:45</div>
          </div>
        </div>

        <div className="transaction">
          <div className="left">
            <div className="name">Gig job new website</div>
            <div className="description">gig new job website</div>
          </div>
          <div className="right">
            <div className="price green">+$400.00</div>
            <div className="datetime">20/09/2021 15:45</div>
          </div>
        </div>

        <div className="transaction">
          <div className="left">
            <div className="name">Iphone </div>
            <div className="description">It was time for new tv</div>
          </div>
          <div className="right">
            <div className="price red">-$500.00</div>
            <div className="datetime">20/09/2021 15:45</div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default App;
