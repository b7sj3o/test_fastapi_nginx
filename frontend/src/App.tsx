import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Item {
  id: number
  name: string
  price: number
}

axios.defaults.baseURL = 'http://localhost:8000'


function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  useEffect(() => {
    async function fetchItems() {
      const response = await axios.get('/items');
      setItems(response.data);
    }
    fetchItems();
  }, [isCreated])

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await axios.post('/items/create', { name, price });
      setName('');
      setPrice(0);
      setIsCreated(!isCreated);
      setMessage('Item added successfully!');
    } catch (error) {
      console.log(error)
      setMessage('Failed to add item.');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteItem = async (id: number) => {
    setLoading(true);
    setMessage(null);
    try {
      await axios.delete(`/items/delete${id}`);
      setItems((prev) => prev.filter(item => item.id !== id));
      setMessage('Item deleted successfully!');
      setIsCreated(!isCreated);
    }
    catch (error) {
      console.log(error)
      setMessage('Failed to delete item.');
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <div className="App flex flex-col-reverse justify-center min-h-screen gap-10">
      <div className="w-full flex flex-col items-center gap-4">
        <ul
          className="w-200 space-y-4 overflow-y-scroll"
          style={{ maxHeight: '250px' }}
        >
          {items.map((item, idx) => (
        <li
          key={idx}
          className="bg-white shadow-md rounded-lg px-6 py-4 flex justify-between items-center border border-gray-200"
        >
          <span className="text-lg font-semibold text-gray-800">{item.name}</span>
          <span className="text-lg text-blue-600 font-bold">${item.price}</span>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => handleDeleteItem(idx)}
          >
            Delete
          </button>
        </li>
          ))}
        </ul>
      </div>
      
      <form
        className="w-100 max-w-2xl mx-auto h-fit bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
        onSubmit={handleSubmitForm}
      >
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-black"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 text-black"
            min={0}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
        {message && (
          <div className="text-center text-sm mt-2 text-gray-700">{message}</div>
        )}
      </form>
    </div>
  )
}

export default App
