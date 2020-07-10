import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoverpasswordPage } from './recoverpassword.page';

describe('RecoverpasswordPage', () => {
  let component: RecoverpasswordPage;
  let fixture: ComponentFixture<RecoverpasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoverpasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverpasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
