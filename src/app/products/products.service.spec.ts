import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders } from '@angular/common/http';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let authServiceStub: Partial<AuthService>;

  beforeEach(() => {
    authServiceStub = {
      baseUrl: 'http://mockapi.com',
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: AuthService, useValue: authServiceStub },
      ],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch products', () => {
    const mockProducts = [
      {
        _id: '1',
        id: '1',
        title: 'Product 1',
        price: 10,
        description: '',
        imageCover: '',
      },
      {
        _id: '2',
        id: '2',
        title: 'Product 2',
        price: 20,
        description: '',
        imageCover: '',
      },
    ];

    service.fetchProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://mockapi.com/products');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should add a product to cart', () => {
    const headers = new HttpHeaders({ Authorization: 'Bearer token' });
    const mockResponse = {
      data: {
        products: [
          {
            _id: '1',
            price: 100,
            title: 'P1',
            description: '',
            imageCover: '',
          },
        ],
      },
    };

    service.addToCart('1', headers).subscribe((cart) => {
      expect(cart.length).toBe(1);
      expect(cart[0]._id).toBe('1');
      expect(cart[0].price).toBe(100);
      expect(cart[0].count).toBe(1);
    });

    const req = httpMock.expectOne('http://mockapi.com/cart');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ productId: '1' });
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(mockResponse);
  });
});
