import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'keys' | 'ranks' | 'cosmetics';
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {
  activeCategory: 'keys' | 'ranks' | 'cosmetics' = 'keys';
  
  storeItems: StoreItem[] = [
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
  
  get filteredItems(): StoreItem[] {
    return this.storeItems.filter(item => item.category === this.activeCategory);
  }
  
  setCategory(category: 'keys' | 'ranks' | 'cosmetics') {
    this.activeCategory = category;
  }
}