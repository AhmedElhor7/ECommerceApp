import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { By } from '@angular/platform-browser';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
  });

  it('should not display alert when message is empty', () => {
    component.message = '';
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('.alert'));
    expect(alertElement).toBeNull(); // should not be rendered
  });

  it('should display alert with correct message and type', () => {
    component.message = 'Test alert';
    component.type = 'danger';
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('.alert'));
    expect(alertElement).not.toBeNull();
    expect(alertElement.nativeElement.textContent).toContain('Test alert');
    expect(alertElement.nativeElement.classList).toContain('alert-danger');
  });

  it('should apply default type class if none is given', () => {
    component.message = 'Default type alert';
    component.type = '';
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('.alert'));
    expect(alertElement.nativeElement.className).toContain('alert-');
  });
});
