import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ConfirmpageComponent } from "./confirmpage.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ConfirmpageComponent", () => {

  let fixture: ComponentFixture<ConfirmpageComponent>;
  let component: ConfirmpageComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ConfirmpageComponent]
    });

    fixture = TestBed.createComponent(ConfirmpageComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
