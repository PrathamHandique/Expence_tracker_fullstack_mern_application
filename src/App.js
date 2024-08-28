import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions(){
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }
    
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

  let bal=0;
  for (const transaction of transactions) {
    bal += transaction.price;
  }

  return (
    <main>
      <h1>${bal}<span>.00</span></h1>
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
        {transactions.length >0 && transactions.map(transaction =>(
          <div className="transaction">
          <div className="left">
            <div className="name">{transaction.name}</div>
            <div className="description">{transaction.description}</div>
          </div>
          <div className="right">
            <div className="price red">{transaction.price}</div>
            <div className="datetime">20/09/2021 15:45</div>
          </div>
        </div>
        ))}
      </div>
    </main>
  );
}

export default App;
