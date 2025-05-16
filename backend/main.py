from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pydantic
import uvicorn

app = FastAPI()

class ItemData(pydantic.BaseModel):
    name: str
    price: float

items = [
    {"id": 1, "name": "Item 1", "price": 10.0},
    {"id": 2, "name": "Item 2", "price": 20.0},
    {"id": 3, "name": "Item 3", "price": 30.0},
]

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items")
def read_items():
    return items

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if len(items) > item_id-1:
        return items[item_id-1]
    else:
        return {"error": "Item not found"}

@app.post("/items/create")
def create_item(data: ItemData):
    items.append({
        "id": len(items) + 1,
        "name": data.name,
        "price": data.price
    })
    return {"message": "Item created", "item": data}

@app.delete("/items/delete{item_id}")
def delete_item(item_id: int):
    if len(items) > item_id-1:
        del items[item_id-1]
        return {"message": "Item deleted"}
    else:
        return {"error": "Item not found"}
    


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)