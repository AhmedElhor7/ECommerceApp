import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mock standalone alert component
@Component({
  selector: 'app-alert',
  template: '',
  standalone: true,
})
class MockAlertComponent {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  function createFakeForm(valid: boolean, values: any): NgForm {
    return jasmine.createSpyObj('NgForm', ['reset'], {
      valid,
      value: values,
    });
  }

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        MockAlertComponent,
        HttpClientTestingModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMessage if form is invalid on submit', () => {
    const fakeForm = createFakeForm(false, {});
    component.onSubmit(fakeForm);
    expect(component.errorMessage).toBe('Invalid form data');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should register successfully, navigate and reset form', fakeAsync(() => {
    const fakeForm = createFakeForm(true, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'pass123',
      rePassword: 'pass123',
      phone: '1234567890',
    });

    const mockResponse = {
      token: 'abc123',
      message: 'Registered successfully',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };

    authServiceSpy.register.and.returnValue(of(mockResponse));

    component.onSubmit(fakeForm);
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeNull();
    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'John Doe',
      'john@example.com',
      'pass123',
      'pass123',
      '1234567890'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(fakeForm.reset).toHaveBeenCalled();
  }));

  it('should set errorMessage on registration failure', fakeAsync(() => {
    const fakeForm = createFakeForm(true, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'pass123',
      rePassword: 'pass123',
      phone: '1234567890',
    });

    const errorMsg = 'Registration failed';
    authServiceSpy.register.and.returnValue(throwError(() => errorMsg));

    component.onSubmit(fakeForm);
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe(errorMsg);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(fakeForm.reset).not.toHaveBeenCalled();
  }));
});
