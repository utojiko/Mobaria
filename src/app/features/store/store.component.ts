import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartItem, CategoryType, StoreItem, StoreService } from './store.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {
  cartItems: CartItem[] = [];
  storeItems: StoreItem[] = [];
  activeCategory: CategoryType = 'keys';

  constructor(private storeService: StoreService, private route: ActivatedRoute, private router: Router) {
    this.storeService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    this.storeItems = this.storeService.getStoreItems();

    // Listen to route changes to update the active category
    this.route.params.subscribe(params => {
      const category = params['category'] as CategoryType;
      if (category && ['keys', 'ranks', 'cosmetics', 'pannier'].includes(category)) {
        this.activeCategory = category;
      } else {
        this.router.navigate(['/store/keys']); // Default to 'keys' if category is invalid
      }
    });
  }
  
  get filteredItems(): StoreItem[] {
    return this.storeItems.filter(item => item.category === this.activeCategory);
  }


  setCategory(category: CategoryType) {
    this.router.navigate(['/store', category]);
  }

  getDiscountedPrice(item: StoreItem): number {
    if (item.discount) {
      return item.price * (1 - item.discount / 100);
    }
    return item.price;
  }

  updateQuantity(itemId: string, quantity: number) {
    this.storeService.updateQuantity(itemId, quantity);
  }

  removeFromCart(itemId: string) {
    this.storeService.removeFromCart(itemId);
  }

  getTotalPrice(): number {
    return this.storeService.getTotalPrice();
  }

  addToCart(itemId: string, quantity: number = 1) {
    this.storeService.addToCart(itemId, quantity);
  }

  get totalCartItems(): number {
    return this.cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  }

  getItemQuantity(itemId: string): number {
    const cartItem = this.cartItems.find(cartItem => cartItem.item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  }
}