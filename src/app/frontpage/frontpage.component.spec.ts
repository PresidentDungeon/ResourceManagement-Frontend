import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FrontpageComponent } from "./frontpage.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("FrontpageComponent", () => {

  let fixture: ComponentFixture<FrontpageComponent>;
  let component: FrontpageComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [FrontpageComponent]
    });

    fixture = TestBed.createComponent(FrontpageComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
