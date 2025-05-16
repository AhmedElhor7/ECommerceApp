import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartProductAuthService } from '../shared/cart-product.service';
import { HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CartComponent } from './cart.component';
import { CartService } from './cart.service';
import { CartProduct, CartResponse } from '../interface/cart.interface';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let cartProductAuthServiceSpy: jasmine.SpyObj<CartProductAuthService>;

  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'fetchCart',
      'deleteAllCart',
    ]);
    cartProductAuthServiceSpy = jasmine.createSpyObj('CartProductAuthService', [
      'showAlert',
      'getAuthHeaders',
    ]);

    await TestBed.configureTestingModule({
      imports: [CartComponent, HttpClientTestingModule],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        {
          provide: CartProductAuthService,
          useValue: cartProductAuthServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    // Default stub for fetchProducts to avoid subscribe errors
    cartServiceSpy.fetchCart.and.returnValue(of([]));
  });

  it('should load cart correctly', () => {
    // 1) Stub getAuthHeaders to simulate a logged‑in user:
    const mockHeaders = new HttpHeaders({ Authorization: 'Bearer token' });
    cartProductAuthServiceSpy.getAuthHeaders.and.returnValue(mockHeaders);

    // 2) Prepare the mock cart response
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
    cartServiceSpy.fetchCart.and.returnValue(of(mockCartProducts));

    // 3) Trigger ngOnInit and detect changes
    fixture.detectChanges();

    // 4) Assertions
    expect(component.cart.length).toBe(1);
    expect(component.cart).toEqual(mockCartProducts);
    expect(component.isLoading).toBeFalse(); // spinner should stop
  });

  it('should show alert message if fetch Cart fails', () => {
    cartServiceSpy.fetchCart.and.returnValue(
      throwError(() => ({ message: 'Failed to fetch Cart' }))
    );

    fixture.detectChanges();

    expect(component.alertMessage).toBe('Please login to view your cart');
    expect(component.alertType).toBe('danger');
    expect(cartProductAuthServiceSpy.showAlert).toHaveBeenCalledWith(
      'Please login to view your cart',
      'danger'
    );
  });

  it('should delete all cart and return an empty array', () => {
    // 1) Simulate auth headers
    const headers = new HttpHeaders({ Authorization: 'Bearer token' });
    cartProductAuthServiceSpy.getAuthHeaders.and.returnValue(headers);

    // 2) Mock empty cart response
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

    // 3) Mock the service method to return an observable with just the product list
    cartServiceSpy.deleteAllCart.and.returnValue(
      of(mockResponse.data.products)
    );

    // 4) Act - Call the actual method you're testing
    component.onDeleteAllCart();

    // 5) Assert - check the component's behavior
    expect(component.cart).toEqual([]);
    expect(component.isLoading).toBeFalse();
    expect(cartProductAuthServiceSpy.showAlert).toHaveBeenCalledWith(
      'All cart deleted successfully',
      'success'
    );
  });

  it('should show alert message if Delete All Cart fails', () => {
    // 1) Simulate auth headers so the component does not early-return
    const headers = new HttpHeaders({ Authorization: 'Bearer token' });
    cartProductAuthServiceSpy.getAuthHeaders.and.returnValue(headers);

    // 2) Mock the service to throw an error
    cartServiceSpy.deleteAllCart.and.returnValue(
      throwError(() => ({ message: 'Failed to delete all cart' }))
    );

    // 3) Call the component method
    component.onDeleteAllCart();

    // 4) Assert that the component handled the error
    expect(component.alertMessage).toBe('Failed to delete all cart');
    expect(component.alertType).toBe('danger');
    expect(cartProductAuthServiceSpy.showAlert).toHaveBeenCalledWith(
      'Failed to delete all cart',
      'danger'
    );
    // The spinner should also be stopped
    expect(component.isLoading).toBeFalse();
  });

  it('should show success alert when Delete All Cart succeeds', () => {
    // 1) Simulate auth headers so the component does not early-return
    const headers = new HttpHeaders({ Authorization: 'Bearer token' });
    cartProductAuthServiceSpy.getAuthHeaders.and.returnValue(headers);

    // 2) Mock the service to return an empty cart (success)
    cartServiceSpy.deleteAllCart.and.returnValue(of([]));

    // 3) Call the component method
    component.onDeleteAllCart();

    // 4) Assert that the success path ran
    expect(component.alertMessage).toBe('All cart deleted successfully');
    expect(component.alertType).toBe('success');
    expect(component.cart).toEqual([]);
    expect(component.isLoading).toBeFalse();
    expect(cartProductAuthServiceSpy.showAlert).toHaveBeenCalledWith(
      'All cart deleted successfully',
      'success'
    );
  });

  it('should show "Your cart is empty." when cart list is empty', () => {
    cartServiceSpy.fetchCart.and.returnValue(of([]));

    fixture.detectChanges();

    const message = fixture.nativeElement
      .querySelector('p')
      ?.textContent?.trim();
    expect(message).toBe('Your cart is empty.');
  });

});
