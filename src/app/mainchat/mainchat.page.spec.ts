import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainchatPage } from './mainchat.page';

describe('MainchatPage', () => {
  let component: MainchatPage;
  let fixture: ComponentFixture<MainchatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainchatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainchatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
