import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    routerNavigateSpy = spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  // Helper function to create fake NgForm
  function createFakeForm(valid: boolean, values: any): NgForm {
    return jasmine.createSpyObj('NgForm', ['reset'], {
      valid,
      value: values,
    }) as unknown as NgForm;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMessage if form is invalid on submit', () => {
    const fakeForm = createFakeForm(false, {});
    component.onSubmit(fakeForm);
    expect(component.errorMessage).toBe('Invalid form data');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should login successfully and navigate, reset form', fakeAsync(() => {
    const fakeForm = createFakeForm(true, {
      email: 'john@example.com',
      password: 'pass123',
    });

    const mockResponse = {
      token: 'abc123',
      message: 'Logged in',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.onSubmit(fakeForm);

    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeNull();
    expect(authServiceSpy.login).toHaveBeenCalledWith(
      'john@example.com',
      'pass123'
    );
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/products']);
    expect(fakeForm.reset).toHaveBeenCalled();
  }));

  it('should set errorMessage on login failure', fakeAsync(() => {
    const fakeForm = createFakeForm(true, {
      email: 'john@example.com',
      password: 'wrongpass',
    });

    const errorMsg = 'Invalid email or password';
    authServiceSpy.login.and.returnValue(throwError(() => errorMsg));

    component.onSubmit(fakeForm);

    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe(errorMsg);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(fakeForm.reset).not.toHaveBeenCalled();
  }));
});
