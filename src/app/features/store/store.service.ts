import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type CategoryType = 'keys' | 'ranks' | 'cosmetics' | 'pannier';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: CategoryType;
  discount?: number;
}

export interface CartItem {
  item: StoreItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Mock store data
  private storeItems: StoreItem[] = [
    {
      id: 'common-key',
      name: 'Clé Commune',
      description: 'Ouvre un coffre commun contenant des objets basiques pour votre aventure.',
      price: 2.50,
      image: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'keys'
    },
    {
      id: 'rare-key',
      name: 'Clé Rare',
      description: 'Ouvre un coffre rare avec une chance d\'obtenir des objets de qualité supérieure.',
      price: 5.00,
      image: 'https://images.pexels.com/photos/4502965/pexels-photo-4502965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'keys'
    },
    {
      id: 'legendary-key',
      name: 'Clé Légendaire',
      description: 'Ouvre un coffre légendaire contenant des objets uniques et puissants.',
      price: 10.00,
      image: 'https://images.pexels.com/photos/2449452/pexels-photo-2449452.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'keys'
    },
    {
      id: 'vip-rank',
      name: 'Grade VIP',
      description: 'Accès à des commandes exclusives, slots prioritaires et tag VIP.',
      price: 15.00,
      image: 'https://images.pexels.com/photos/4039921/pexels-photo-4039921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'ranks'
    },
    {
      id: 'elite-rank',
      name: 'Grade Élite',
      description: 'Tous les avantages VIP plus des kits exclusifs et des effets de particules.',
      price: 25.00,
      image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'ranks'
    },
    {
      id: 'legend-rank',
      name: 'Grade Légende',
      description: 'Notre grade premium avec tous les avantages et des objets exclusifs.',
      price: 40.00,
      image: 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'ranks'
    },
    {
      id: 'pet-dragon',
      name: 'Familier Dragon',
      description: 'Un petit dragon qui vous accompagne dans vos aventures.',
      price: 8.00,
      image: 'https://images.pexels.com/photos/6692037/pexels-photo-6692037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'cosmetics'
    },
    {
      id: 'aura-fire',
      name: 'Aura de Feu',
      description: 'Effet visuel de particules de feu autour de votre personnage.',
      price: 6.00,
      image: 'https://images.pexels.com/photos/3804878/pexels-photo-3804878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'cosmetics'
    }
  ];

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Load cart from localStorage if exists
    this.loadCart();
  }

  getStoreItems(): StoreItem[] {
    return this.storeItems;
  }

  getItemsByCategory(category: CategoryType): StoreItem[] {
    return this.storeItems.filter(item => item.category === category);
  }

  getItemById(id: string): StoreItem | undefined {
    return this.storeItems.find(item => item.id === id);
  }

  addToCart(itemId: string, quantity: number = 1): void {
    const item = this.getItemById(itemId);

    if (!item) {
      return;
    }

    const currentCart = this.cartItemsSubject.value;
    const existingItem = currentCart.find(cartItem => cartItem.item.id === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ item, quantity });
    }

    this.cartItemsSubject.next([...currentCart]);
    this.saveCart();
  }

  removeFromCart(itemId: string): void {
    const currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.filter(cartItem => cartItem.item.id !== itemId);
    this.cartItemsSubject.next(updatedCart);
    this.saveCart();
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const currentCart = this.cartItemsSubject.value;
    const existingItem = currentCart.find(cartItem => cartItem.item.id === itemId);

    if (existingItem) {
      existingItem.quantity = quantity;
      this.cartItemsSubject.next([...currentCart]);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCart();
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, cartItem) => {
      const itemPrice = cartItem.item.discount
        ? cartItem.item.price * (1 - cartItem.item.discount / 100)
        : cartItem.item.price;
      return total + (itemPrice * cartItem.quantity);
    }, 0);
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        this.cartItemsSubject.next(parsedCart);
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
        this.cartItemsSubject.next([]);
      }
    }
  }
}