import { db } from '../../lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { Product } from '../../types';

// This is a mock API handler for client-side use
// In a real application, this would be a server-side API endpoint

export async function getProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    
    if (productsSnapshot.empty) {
      return [];
    }
    
    return productsSnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const productDoc = doc(db, 'products', id.toString());
    const productSnapshot = await getDoc(productDoc);
    
    if (!productSnapshot.exists()) {
      return null;
    }
    
    return {
      id: parseInt(productSnapshot.id),
      ...productSnapshot.data()
    } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

export async function createProduct(product (product: Omit<Product, 'id'>): Promise<Product> {
  try {
    // Generate a new ID
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    const existingIds = productsSnapshot.docs.map(doc => parseInt(doc.id));
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    const newProduct = { ...product, id: newId } as Product;
    await setDoc(doc(db, 'products', newId.toString()), newProduct);
    
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}
)

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product> {
  try {
    const productDoc = doc(db, 'products', id.toString());
    const productSnapshot = await getDoc(productDoc);
    
    if (!productSnapshot.exists()) {
      throw new Error('Product not found');
    }
    
    const updatedProduct = {
      ...productSnapshot.data(),
      ...product,
      id
    } as Product;
    
    await setDoc(productDoc, updatedProduct);
    
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', id.toString()));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

// Mock handler for client-side API calls
export default async function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.query.id) {
        const product = await getProduct(parseInt(req.query.id));
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json(product);
      } else {
        const products = await getProducts();
        return res.status(200).json(products);
      }
    case 'POST':
      const newProduct = await createProduct(req.body);
      return res.status(201).json(newProduct);
    case 'PUT':
      const updatedProduct = await updateProduct(parseInt(req.query.id), req.body);
      return res.status(200).json(updatedProduct);
    case 'DELETE':
      await deleteProduct(parseInt(req.query.id));
      return res.status(204).end();
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}