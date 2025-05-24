import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WikiDataService } from './wiki-data.service';
import { GameClass } from '../../models/class.model';
import 'jest-preset-angular/setup-jest';

describe('WikiDataService', () => {
    let service: WikiDataService;
    let httpMock: HttpTestingController;
    const CLASSES_STORAGE_KEY = 'mobaria_classes';
    const CLASSES_TIMESTAMP_KEY = 'mobaria_classes_timestamp';

    const mockClasses: GameClass[] = [
        {
            id: 'guerrier',
            name: 'Guerrier',
            description: 'Description du guerrier',
            color: 'var(--color-guerrier)',
            icon: 'gavel',
            stats: {
                damage: 8,
                defense: 9,
                mobility: 5,
                utility: 3
            },
            abilities: [
                {
                    name: 'Frappe Puissante',
                    description: 'Une attaque lourde',
                    cooldown: '10 secondes'
                }
            ],
            playstyle: 'Playstyle du guerrier'
        },
        {
            id: 'mage',
            name: 'Mage',
            description: 'Description du mage',
            color: 'var(--color-mage)',
            icon: 'auto_fix_high',
            stats: {
                damage: 10,
                defense: 3,
                mobility: 4,
                utility: 8
            },
            abilities: [
                {
                    name: 'Nova Arcanique',
                    description: 'Une explosion d\'énergie',
                    cooldown: '12 secondes'
                }
            ],
            playstyle: 'Playstyle du mage'
        }
    ];

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.removeItem(CLASSES_STORAGE_KEY);
        localStorage.removeItem(CLASSES_TIMESTAMP_KEY);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [WikiDataService]
        });

        service = TestBed.inject(WikiDataService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should load classes from JSON file and store in localStorage', (done) => {
        service.getClasses().subscribe(classes => {
            expect(classes).toEqual(mockClasses);

            // Check if data was stored in localStorage
            const cachedData = localStorage.getItem(CLASSES_STORAGE_KEY);
            expect(cachedData).toBeTruthy();
            expect(JSON.parse(cachedData!)).toEqual(mockClasses);
            done();
        });

        const req = httpMock.expectOne('assets/data/class-details.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockClasses);
    });

    it('should get classes from localStorage if available and cache is valid', (done) => {
        // First, store data in localStorage with a valid timestamp
        const now = Date.now();
        localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(mockClasses));
        localStorage.setItem(CLASSES_TIMESTAMP_KEY, now.toString());

        service.getClasses().subscribe(classes => {
            expect(classes).toEqual(mockClasses);

            // No HTTP request should be made
            httpMock.expectNone('assets/data/class-details.json');
            done();
        });
    });

    it('should refresh data if cache timestamp is expired', (done) => {
        // Store data with an expired timestamp (more than 24 hours old)
        const expired = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
        localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(mockClasses));
        localStorage.setItem(CLASSES_TIMESTAMP_KEY, expired.toString());

        service.getClasses().subscribe(classes => {
            expect(classes).toEqual(mockClasses);
            done();
        });

        // Should make an HTTP request to refresh the expired data
        const req = httpMock.expectOne('assets/data/class-details.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockClasses);
    });

    it('should get class by id from localStorage if available and cache is valid', (done) => {
        // First, store data in localStorage with a valid timestamp
        const now = Date.now();
        localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(mockClasses));
        localStorage.setItem(CLASSES_TIMESTAMP_KEY, now.toString());

        service.getClassById('mage').subscribe(foundClass => {
            expect(foundClass).toEqual(mockClasses[1]);

            // No HTTP request should be made
            httpMock.expectNone('assets/data/class-details.json');
            done();
        });
    });

    it('should get class by id from JSON if not in localStorage', (done) => {
        service.getClassById('mage').subscribe(foundClass => {
            expect(foundClass).toEqual(mockClasses[1]);
            done();
        });

        const req = httpMock.expectOne('assets/data/class-details.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockClasses);
    });

    it('should clear the cache when clearClassesCache is called', () => {
        // First, set up some data in localStorage
        localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(mockClasses));
        localStorage.setItem(CLASSES_TIMESTAMP_KEY, Date.now().toString());

        // Call the method to clear cache
        service.clearClassesCache();

        // Verify the cache was cleared
        expect(localStorage.getItem(CLASSES_STORAGE_KEY)).toBeNull();
        expect(localStorage.getItem(CLASSES_TIMESTAMP_KEY)).toBeNull();
    });
});