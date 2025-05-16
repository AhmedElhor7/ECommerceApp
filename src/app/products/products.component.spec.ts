import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsService } from './products.service';
import { CartProductAuthService } from '../shared/cart-product.service';
import { HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ProductCart } from '../interface/product.interface';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let cartProductAuthServiceSpy: jasmine.SpyObj<CartProductAuthService>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'fetchProducts',
      'addToCart',
    ]);
    cartProductAuthServiceSpy = jasmine.createSpyObj('CartProductAuthService', [
      'showAlert',
      'getAuthHeaders',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, HttpClientTestingModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        {
          provide: CartProductAuthService,
          useValue: cartProductAuthServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;

    // Default stub for fetchProducts to avoid subscribe errors
    productsServiceSpy.fetchProducts.and.returnValue(of([]));
  });

  it('should load products correctly', () => {
    const mockProducts = [
      {
        _id: '1',
        id: '1',
        title: 'Product 1',
        price: 100,
        description: 'Description 1',
        imageCover: 'image1.jpg',
      },
      {
        _id: '2',
        id: '2',
        title: 'Product 2',
        price: 200,
        description: 'Description 2',
        imageCover: 'image2.jpg',
      },
    ];
    productsServiceSpy.fetchProducts.and.returnValue(of(mockProducts));

    fixture.detectChanges();

    expect(component.products).toEqual(mockProducts);
    expect(component.products.length).toBe(2);
  });

  it('should show alert message if fetchProducts fails', () => {
    productsServiceSpy.fetchProducts.and.returnValue(
      throwError(() => ({ message: 'Failed to fetch products' }))
    );

    fixture.detectChanges();

    expect(component.alertMessage).toBe(
      'Could not load products at this time.'
    );
    expect(component.alertType).toBe('danger');
    expect(cartProductAuthServiceSpy.showAlert).toHaveBeenCalledWith(
      'Could not load products at this time.',
      'danger'
    );
  });

  it('should add a product to the cart', () => {
    const mockHeaders = new HttpHeaders({ Authorization: 'Bearer token' });
    const mockResponse: ProductCart[] = [
      {
        _id: '1',
        price: 100,
        count: 1,
        product: {
          _id: '1',
          id: '1',
          title: 'Product 1',
          price: 100,
          description: 'Description 1',
          imageCover: 'image1.jpg',
        },
      },
    ];

    cartProductAuthServiceSpy.getAuthHeaders.and.returnValue(mockHeaders);
    productsServiceSpy.addToCart.and.returnValue(of(mockResponse));

    component.onAddToCart('1');

    expect(component.alertMessage).toBe('Product added to cart successfully');
    expect(component.alertType).toBe('success');
    expect(cartProductAuthServiceSpy.showAlert).toHaveBeenCalledWith(
      'Product added to cart successfully',
      'success'
    );
    expect(productsServiceSpy.addToCart).toHaveBeenCalledWith('1', mockHeaders);
  });

  it('should show alert message if no auth headers available when adding to cart', () => {
    cartProductAuthServiceSpy.getAuthHeaders.and.returnValue(null);

    component.onAddToCart('1');

    expect(component.alertMessage).toBe('Please login to add product to cart');
    expect(component.alertType).toBe('danger');
    expect(cartProductAuthServiceSpy.showAlert).toHaveBeenCalledWith(
      'Please login to add product to cart',
      'danger'
    );
    expect(productsServiceSpy.addToCart).not.toHaveBeenCalled();
  });

  it('should handle error when adding product to cart', () => {
    const mockHeaders = new HttpHeaders({ Authorization: 'Bearer token' });
    cartProductAuthServiceSpy.getAuthHeaders.and.returnValue(mockHeaders);
    productsServiceSpy.addToCart.and.returnValue(
      throwError(() => ({ message: 'Failed to add product to cart' }))
    );

    component.onAddToCart('1');

    expect(component.alertMessage).toBe('Failed to add product to cart');
    expect(component.alertType).toBe('danger');
    expect(cartProductAuthServiceSpy.showAlert).toHaveBeenCalledWith(
      'Failed to add product to cart',
      'danger'
    );
  });

  it('should show "Sorry No Products To Show" when product list is empty', () => {
    productsServiceSpy.fetchProducts.and.returnValue(of([]));

    fixture.detectChanges();

    const message = fixture.nativeElement
      .querySelector('p')
      ?.textContent?.trim();
    expect(message).toBe('Sorry No Products To Show');
  });
  
});
