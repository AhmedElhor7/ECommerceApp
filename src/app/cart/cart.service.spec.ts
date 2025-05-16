import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { CartService } from './cart.service';
import { CartProduct, CartResponse } from '../interface/cart.interface';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let authServiceStub: Partial<AuthService>;

  beforeEach(() => {
    authServiceStub = { baseUrl: 'http://mockapi.com' };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CartService,
        { provide: AuthService, useValue: authServiceStub },
      ],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch cart', () => {
    // 1) Create the headers object
    const headers = new HttpHeaders({ Authorization: 'Bearer token' });

    // 2) Declare a mock CartProduct[]
    const mockCartProducts: CartProduct[] = [
      {
        count: 1,
        _id: '1',
        price: 100,
        product: {
          subcategory: [
            { _id: '1', name: 'Subcat', slug: 'subcat', category: 'cat' },
          ],
          _id: '1',
          title: 'Product 1',
          quantity: 5,
          imageCover: 'img.jpg',
          category: {
            _id: '1',
            name: 'Category',
            slug: 'category',
            image: 'cat.jpg',
          },
          brand: 'BrandX',
          ratingsAverage: 4.5,
          id: '1',
        },
      },
    ];

    // 3) Build a mock CartResponse that matches the service's expected shape
    const mockResponse: CartResponse = {
      status: 'success',
      numOfCartItems: 1,
      cartId: 'abc123',
      data: {
        _id: 'cart1',
        cartOwner: 'user1',
        products: mockCartProducts,
        createdAt: '',
        updatedAt: '',
        __v: 0,
        totalCartPrice: 100,
      },
    };

    // 4) Subscribe and assert
    service.fetchCart(headers).subscribe((cart) => {
      expect(cart.length).toBe(1);
      expect(cart).toEqual(mockCartProducts);
    });

    // 5) Expect the GET and flush the mockResponse
    const req = httpMock.expectOne('http://mockapi.com/cart');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');

    // Flush with the full mockResponse
    req.flush(mockResponse);
  });

  it('should delete all cart and return an empty array', () => {
    // 1) Create the headers object
    const headers = new HttpHeaders({ Authorization: 'Bearer token' });

    // 2) Build a mock CartResponse that matches the service's expected shape
    const mockResponse: CartResponse = {
      status: 'success',
      numOfCartItems: 0,
      cartId: 'abc123',
      data: {
        _id: '',
        cartOwner: 'user1',
        products: [],
        createdAt: '',
        updatedAt: '',
        __v: 0,
        totalCartPrice: 0,
      },
    };

    // 3) Subscribe and assert
    service.deleteAllCart(headers).subscribe((cart) => {
      expect(cart.length).toBe(0);
      expect(cart).toEqual([]);
    });

    // 4) Expect the GET and flush the mockResponse
    const req = httpMock.expectOne('http://mockapi.com/cart');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');

    // Flush with the full mockResponse
    req.flush(mockResponse);
  });

});
