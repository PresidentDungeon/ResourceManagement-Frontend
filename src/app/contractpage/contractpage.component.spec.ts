import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ContractpageComponent } from "./contractpage.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ContractpageComponent", () => {

  let fixture: ComponentFixture<ContractpageComponent>;
  let component: ContractpageComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ContractpageComponent]
    });

    fixture = TestBed.createComponent(ContractpageComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
