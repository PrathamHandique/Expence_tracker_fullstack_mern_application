import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        datetime,
        description,
      }),
    }).then((response) => {
      return response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        setTransactions((prev) => [...prev, json]); // Update the transaction list
      });
    });
  }

  function startEditing(transactionId) {
    setIsEditing(transactionId);
  }

  function cancelEditing() {
    setIsEditing(null);
  }

  function saveEdit(transactionId) {
    const transaction = transactions.find((t) => t._id === transactionId);
    if (!transaction) return;

    const url = process.env.REACT_APP_API_URL + "/transaction/" + transactionId;
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: transaction.price,
        name: transaction.name,
        datetime: transaction.datetime,
        description: transaction.description,
      }),
    }).then((response) => {
      return response.json().then((json) => {
        setIsEditing(null);
      });
    });
  }

  function handleEditChange(transactionId, field, value) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction._id === transactionId
          ? { ...transaction, [field]: value }
          : transaction
      )
    );
  }

  function deleteTransaction(transactionId) {
    const url = process.env.REACT_APP_API_URL + "/transaction/" + transactionId;
    fetch(url, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setTransactions((prev) =>
            prev.filter((transaction) => transaction._id !== transactionId)
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting transaction:", error);
      });
  }

  let bal = 0;
  for (const transaction of transactions) {
    bal += parseFloat(transaction.price);
  }

  return (
    <main>
      <h1>${bal.toFixed(2)}</h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            placeholder={"+200 new samsung tv"}
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
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction" key={transaction._id}>
              {isEditing === transaction._id ? (
                <>
                  <div className="left">
                    <input
                      type="text"
                      value={transaction.name}
                      onChange={(ev) =>
                        handleEditChange(transaction._id, "name", ev.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={transaction.description}
                      onChange={(ev) =>
                        handleEditChange(
                          transaction._id,
                          "description",
                          ev.target.value
                        )
                      }
                    />
                    <input
                      type="datetime-local"
                      value={transaction.datetime}
                      onChange={(ev) =>
                        handleEditChange(
                          transaction._id,
                          "datetime",
                          ev.target.value
                        )
                      }
                    />
                    <input
                      type="text"
                      value={transaction.price}
                      onChange={(ev) =>
                        handleEditChange(transaction._id, "price", ev.target.value)
                      }
                    />
                  </div>
                  <div>
                    <button onClick={() => saveEdit(transaction._id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    <div className="price red">{transaction.price}</div>
                    <div className="datetime">{transaction.datetime}</div>
                  </div>
                  <div>
                    <button onClick={() => startEditing(transaction._id)}>Edit</button>
                    <button onClick={() => deleteTransaction(transaction._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
