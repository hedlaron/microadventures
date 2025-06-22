from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.db.models import Product, User_Pydantic

router = APIRouter()

# Sample products data
products = [
    Product(id=1, name="Macbook Pro", price=1000, date_added="2025-01-01"),
    Product(id=2, name="iPhone 15", price=1000, date_added="2025-01-01"),
    Product(id=3, name="iPad Pro", price=1000, date_added="2025-01-01"),
    Product(id=4, name="Apple Watch", price=1000, date_added="2025-01-01"),
    Product(id=5, name="AirPods Pro", price=1000, date_added="2025-01-01"),
]

@router.get("/products")
def get_products() -> list[Product]:
    return products

@router.get("/products/{product_id}")
def get_product(product_id: int):
    product = next((p for p in products if p.id == product_id), None)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

@router.post("/products")
async def create_product(product: Product, user: User_Pydantic = Depends(get_current_user)):
    products.append(product)
    return product

@router.put("/products/{product_id}")
async def update_product(product_id: int, updated_product: Product, user: User_Pydantic = Depends(get_current_user)):
    for i, product in enumerate(products):
        if product.id == product_id:
            products[i] = updated_product
            return updated_product
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found") 