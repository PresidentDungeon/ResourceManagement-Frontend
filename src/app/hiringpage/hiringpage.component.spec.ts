import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HiringpageComponent } from "./hiringpage.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("HiringpageComponent", () => {

  let fixture: ComponentFixture<HiringpageComponent>;
  let component: HiringpageComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [HiringpageComponent]
    });

    fixture = TestBed.createComponent(HiringpageComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
