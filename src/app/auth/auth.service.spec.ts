import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthResponseData } from '../interface/auth.interface';
import { User } from './user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let setItemSpy: jasmine.Spy;

  const loginAPI = 'https://ecommerce.routemisr.com/api/v1/auth/signin';
  const registerAPI = 'https://ecommerce.routemisr.com/api/v1/auth/signup';

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    setItemSpy = spyOn(window.localStorage, 'setItem');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    setItemSpy.calls.reset(); // Clean for next test
  });

  // -------- LOGIN TESTS --------

  it('should login successfully and store user', (done) => {
    const mockResponse: AuthResponseData = {
      token: 'abc123',
      message: 'Logged in',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };

    service.login('john@example.com', 'pass123').subscribe({
      next: (res) => {
        expect(res).toEqual(mockResponse);

        service.user.subscribe((user) => {
          expect(user).toEqual(
            new User(
              mockResponse.email,
              mockResponse.name,
              mockResponse.role,
              mockResponse.token
            )
          );
        });

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'userData',
          jasmine.stringMatching(/"email":"john@example\.com"/)
        );

        done();
      },
      error: () => fail('should not error'),
    });

    const req = httpMock.expectOne(loginAPI);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'john@example.com',
      password: 'pass123',
    });

    req.flush(mockResponse);
  });

  it('should return server error message when statusMsg is "fail" on login', (done) => {
    const errorResponse = {
      status: 400,
      error: {
        statusMsg: 'fail',
        message: 'Invalid email or password',
      },
    };

    service.login('john@example.com', 'wrongpass').subscribe({
      next: () => fail('Should have failed with an error'),
      error: (err) => {
        expect(err.message).toBe('Invalid email or password');
        done();
      },
    });

    const req = httpMock.expectOne(loginAPI);
    req.flush(errorResponse.error, {
      status: 400,
      statusText: 'Bad Request',
    });
  });

  it('should return generic message on unexpected error shape on login', (done) => {
    const mockError = {
      status: 500,
      statusText: 'Server Error',
      error: { foo: 'bar' },
    };

    service.login('any@example.com', 'x').subscribe({
      next: () => fail('expected an error'),
      error: (err: Error) => {
        expect(err.message).toBe('Unknown error occurred');
        done();
      },
    });

    const req = httpMock.expectOne(loginAPI);
    req.flush(mockError.error, {
      status: mockError.status,
      statusText: mockError.statusText,
    });
  });

  // -------- REGISTER TESTS --------

  it('should register successfully and store user', (done) => {
    const mockResponse: AuthResponseData = {
      token: 'def456',
      message: 'Registered successfully',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'user',
      registered: true,
    };

    service
      .register(
        'Jane Doe',
        'jane@example.com',
        'pass123',
        'pass123',
        '1234567890'
      )
      .subscribe({
        next: (res) => {
          expect(res).toEqual(mockResponse);

          service.user.subscribe((user) => {
            expect(user).toEqual(
              new User(
                mockResponse.email,
                mockResponse.name,
                mockResponse.role,
                mockResponse.token
              )
            );
          });

          expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'userData',
            jasmine.stringMatching(/"email":"jane@example\.com"/)
          );

          done();
        },
        error: () => fail('should not error'),
      });

    const req = httpMock.expectOne(registerAPI);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'pass123',
      rePassword: 'pass123',
      phone: '1234567890',
    });

    req.flush(mockResponse);
  });

  it('should return server error message when statusMsg is "fail" on register', (done) => {
    const errorResponse = {
      status: 400,
      error: {
        statusMsg: 'fail',
        message: 'Email already exists',
      },
    };

    service
      .register(
        'Jane Doe',
        'jane@example.com',
        'pass123',
        'pass123',
        '1234567890'
      )
      .subscribe({
        next: () => fail('Should have failed with an error'),
        error: (err) => {
          expect(err.message).toBe('Email already exists');
          done();
        },
      });

    const req = httpMock.expectOne(registerAPI);
    req.flush(errorResponse.error, {
      status: 400,
      statusText: 'Bad Request',
    });
  });

  it('should return generic message on unexpected error shape on register', (done) => {
    const mockError = {
      status: 500,
      statusText: 'Server Error',
      error: { foo: 'bar' },
    };

    service
      .register('Any', 'any@example.com', 'x', 'x', '0000000000')
      .subscribe({
        next: () => fail('expected an error'),
        error: (err: Error) => {
          expect(err.message).toBe('Unknown error occurred');
          done();
        },
      });

    const req = httpMock.expectOne(registerAPI);
    req.flush(mockError.error, {
      status: mockError.status,
      statusText: mockError.statusText,
    });
  });
});
