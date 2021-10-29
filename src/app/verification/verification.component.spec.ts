import { NO_ERRORS_SCHEMA } from "@angular/core";
import { VerificationComponent } from "./verification.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("VerificationComponent", () => {

  let fixture: ComponentFixture<VerificationComponent>;
  let component: VerificationComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [VerificationComponent]
    });

    fixture = TestBed.createComponent(VerificationComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
