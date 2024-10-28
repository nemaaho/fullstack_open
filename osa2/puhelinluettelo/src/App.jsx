import { useState, useEffect } from "react";
import personService from "./services/persons";

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
);

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, deletePerson }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.name}>
        {person.name} {person.number}{" "}
        <button onClick={() => deletePerson(person.id, person.name)}>
          delete{" "}
        </button>
      </li>
    ))}
  </ul>
);

const Message = ({ message, isError }) => {
  if (!message) return null;

  const messageClass = isError ? "error" : "success";

  return <div className={`message ${messageClass}`}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response
              )
            );
            setNewName("");
            setNewNumber("");
            setMessage(`Updated ${newName}'s number`);
            setIsError(false);
            setTimeout(() => setMessage(""), 3000);
          })
          .catch((error) => {
            setMessage(
              `Information of ${newName} has already been removed from server`
            );
            setIsError(true);
            setPersons(
              persons.filter((person) => person.id !== existingPerson.id)
            );
            setTimeout(() => setMessage(""), 5000);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      personService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response));
          setNewName("");
          setNewNumber("");
          setMessage(`Added ${newName}`);
          setTimeout(() => setMessage(""), 3000);
        })
        .catch((error) => {
          console.log(error.response.data);
          setMessage(error.response.data.error);
          setIsError(true);
          setTimeout(() => setMessage(""), 3000);
        });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setMessage(`Deleted ${name}`);
          setIsError(false);
          setTimeout(() => setMessage(""), 3000);
        })
        .catch((error) => {
          setMessage(`Failed to delete ${name}`);
          setIsError(true);
          setTimeout(() => setMessage(""), 3000);
        });
    }
  };

  const personsFilter = persons.filter(
    (person) =>
      person.name && person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} isError={isError} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsFilter} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
